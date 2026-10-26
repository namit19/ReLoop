import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import Product from '../models/Product.js';
import { getReceiverSocketId, io } from '../sockets/chatSocket.js';

/**
 * @desc    Get user's conversations
 * @route   GET /api/conversations
 * @access  Private
 */
export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .sort({ lastMessageAt: -1 })
      .populate('participants', 'name avatar city')
      .populate('product', 'title price thumbnail status')
      .lean();

    // Map each conversation to highlight the other participant
    const formatted = conversations.map((conv) => {
      const otherUser = conv.participants.find(
        (p) => p._id.toString() !== req.user._id.toString()
      );
      return {
        ...conv,
        otherUser,
      };
    });

    res.json({
      success: true,
      conversations: formatted,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create or retrieve existing conversation for a product
 * @route   POST /api/conversations
 * @access  Private
 */
export const getOrCreateConversation = async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required to start a conversation.',
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    // Do not allow users to message themselves
    if (product.seller.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot initiate a conversation with yourself for your own listing.',
      });
    }

    // Look for existing conversation with these participants and product
    let conversation = await Conversation.findOne({
      product: productId,
      participants: { $all: [req.user._id, product.seller] },
    })
      .populate('participants', 'name avatar city')
      .populate('product', 'title price thumbnail status seller');

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, product.seller],
        product: productId,
        lastMessage: 'Started a new conversation',
        lastMessageAt: new Date(),
      });

      conversation = await Conversation.findById(conversation._id)
        .populate('participants', 'name avatar city')
        .populate('product', 'title price thumbnail status seller');
    }

    const otherUser = conversation.participants.find(
      (p) => p._id.toString() !== req.user._id.toString()
    );

    res.json({
      success: true,
      conversation: {
        ...conversation.toObject(),
        otherUser,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get messages for a conversation
 * @route   GET /api/conversations/:id/messages
 * @access  Private
 */
export const getMessages = async (req, res, next) => {
  try {
    const { id } = req.params;

    const conversation = await Conversation.findById(id)
      .populate('participants', 'name avatar city')
      .populate('product', 'title price thumbnail status seller');

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found.',
      });
    }

    // Verify participant authorization
    const isParticipant = conversation.participants.some(
      (p) => p._id.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view messages in this conversation.',
      });
    }

    // Mark unread messages sent by others as read
    await Message.updateMany(
      {
        conversation: id,
        sender: { $ne: req.user._id },
        read: false,
      },
      {
        $set: { read: true, readAt: new Date() },
      }
    );

    const messages = await Message.find({ conversation: id })
      .sort({ createdAt: 1 })
      .populate('sender', 'name avatar');

    const otherUser = conversation.participants.find(
      (p) => p._id.toString() !== req.user._id.toString()
    );

    res.json({
      success: true,
      conversation: {
        ...conversation.toObject(),
        otherUser,
      },
      messages,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Send a message in a conversation
 * @route   POST /api/conversations/:id/messages
 * @access  Private
 */
export const sendMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message text cannot be empty.',
      });
    }

    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found.',
      });
    }

    // Authorization
    const isParticipant = conversation.participants.some(
      (p) => p.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to send messages in this conversation.',
      });
    }

    const message = await Message.create({
      conversation: id,
      sender: req.user._id,
      text: text.trim(),
    });

    // Update conversation last message
    conversation.lastMessage = text.trim();
    conversation.lastMessageAt = new Date();
    await conversation.save();

    const populatedMessage = await Message.findById(message._id).populate('sender', 'name avatar');

    // Real-time notification via Socket.IO
    const receiverId = conversation.participants.find(
      (p) => p.toString() !== req.user._id.toString()
    );

    if (receiverId) {
      const receiverSocketId = getReceiverSocketId(receiverId.toString());
      if (receiverSocketId && io) {
        io.to(receiverSocketId).emit('newMessage', populatedMessage);
      }
    }

    res.status(201).json({
      success: true,
      message: populatedMessage,
    });
  } catch (err) {
    next(err);
  }
};
