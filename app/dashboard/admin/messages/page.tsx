'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  MessageSquare,
  Send,
  Plus,
  RefreshCw,
  CheckCircle,
  Mail,
  User,
  Search,
  XCircle,
  X,
  Phone,
  Video,
  Info,
  Smile,
  MoreVertical,
  Archive,
  Flag,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import messageAPI from '@/lib/api/messageAPI';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface Message {
  _id: string;
  subject: string;
  content: string;
  senderId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  recipientId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  status: 'unread' | 'read' | 'replied' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category:
    | 'general'
    | 'support'
    | 'technical'
    | 'billing'
    | 'feedback'
    | 'application';
  createdAt: string;
  updatedAt: string;
  isRead: boolean;
  isFlagged?: boolean;
  isArchived?: boolean;
}

interface Conversation {
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  lastMessage: Message;
  unreadCount: number;
  messages: Message[];
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [roleFilter, setRoleFilter] = useState('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Compose form
  const [users, setUsers] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [composeForm, setComposeForm] = useState({
    recipientId: '',
    recipientName: '',
    subject: '',
    content: '',
    priority: 'medium' as const,
    category: 'general' as const
  });

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation?.messages]);

  // Debounced user search
  useEffect(() => {
    if (!userSearch || userSearch.length < 2) {
      setUsers([]);
      return;
    }

    const timer = setTimeout(() => {
      searchUsersForMessaging(userSearch, roleFilter);
    }, 300);

    return () => clearTimeout(timer);
  }, [userSearch, roleFilter]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);

      console.log('📨 Fetching messages...');

      // Fetch real data from API
      const [inboxData, sentData] = await Promise.all([
        messageAPI.getInbox({ page: 1, limit: 100 }),
        messageAPI.getSent({ page: 1, limit: 100 })
      ]);

      console.log('📬 Inbox data:', inboxData);
      console.log('📤 Sent data:', sentData);

      const allMessages: Message[] = [];

      if (inboxData.success) {
        allMessages.push(...(inboxData.messages || []));
      }

      if (sentData.success) {
        allMessages.push(...(sentData.messages || []));
      }

      setMessages(allMessages);
      console.log(`✅ Total messages loaded: ${allMessages.length}`);

      organizeConversations(allMessages);
      setLoading(false);
    } catch (error) {
      console.error('❌ Error fetching messages:', error);
      toast.error('Failed to load messages');
      setMessages([]);
      setLoading(false);
    }
  };

  const organizeConversations = (allMessages: Message[]) => {
    // Check if we're in the browser before accessing localStorage
    if (typeof window === 'undefined') return;

    const currentUserId = localStorage.getItem('userId');
    const conversationMap = new Map<string, Conversation>();

    console.log('🔄 Organizing conversations...');
    console.log(`📊 Current User ID: ${currentUserId}`);
    console.log(`📧 Total messages to organize: ${allMessages.length}`);

    allMessages.forEach((message, index) => {
      // Determine the "other" user in the conversation
      const isCurrentUserSender = message.senderId._id === currentUserId;
      const otherUser = isCurrentUserSender
        ? message.recipientId
        : message.senderId;

      const conversationId = otherUser._id;

      console.log(`\n📨 Message ${index + 1}:`);
      console.log(
        `  From: ${message.senderId.firstName} (${message.senderId._id})`
      );
      console.log(
        `  To: ${message.recipientId.firstName} (${message.recipientId._id})`
      );
      console.log(`  Current user is sender: ${isCurrentUserSender}`);
      console.log(`  Other user: ${otherUser.firstName} (${conversationId})`);
      console.log(`  Subject: ${message.subject}`);

      if (!conversationMap.has(conversationId)) {
        console.log(
          `  ✅ Creating new conversation with ${otherUser.firstName}`
        );
        conversationMap.set(conversationId, {
          userId: otherUser._id,
          userName: `${otherUser.firstName} ${otherUser.lastName}`,
          userEmail: otherUser.email,
          userRole: otherUser.role,
          lastMessage: message,
          unreadCount: 0,
          messages: []
        });
      } else {
        console.log(
          `  📌 Adding to existing conversation with ${otherUser.firstName}`
        );
      }

      const conversation = conversationMap.get(conversationId)!;
      conversation.messages.push(message);

      // Update last message if this one is newer
      if (
        new Date(message.createdAt) >
        new Date(conversation.lastMessage.createdAt)
      ) {
        console.log(`  🔄 Updating last message (newer)`);
        conversation.lastMessage = message;
      }

      // Count unread messages (only messages RECEIVED by current user)
      if (message.recipientId._id === currentUserId && !message.isRead) {
        conversation.unreadCount++;
        console.log(
          `  📬 Unread count for this conversation: ${conversation.unreadCount}`
        );
      }
    });

    // Sort messages within each conversation by date (oldest first)
    conversationMap.forEach((conversation, userId) => {
      conversation.messages.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      console.log(`\n👥 Conversation with ${conversation.userName}:`);
      console.log(`  Messages: ${conversation.messages.length}`);
      console.log(`  Unread: ${conversation.unreadCount}`);
      console.log(`  Last message: ${conversation.lastMessage.subject}`);
    });

    // Convert to array and sort by last message date (newest first)
    const conversationsArray = Array.from(conversationMap.values()).sort(
      (a, b) =>
        new Date(b.lastMessage.createdAt).getTime() -
        new Date(a.lastMessage.createdAt).getTime()
    );

    setConversations(conversationsArray);
    console.log(
      `\n✅ SUMMARY: Organized ${conversationsArray.length} conversations`
    );
    console.log(`📋 Conversation list order (by last message):`);
    conversationsArray.forEach((conv, idx) => {
      console.log(
        `  ${idx + 1}. ${conv.userName} - ${conv.messages.length} messages (${
          conv.unreadCount
        } unread)`
      );
    });

    // Auto-select first conversation if none selected
    if (!selectedConversation && conversationsArray.length > 0) {
      selectConversation(conversationsArray[0]);
    }
  };

  const selectConversation = async (conversation: Conversation) => {
    setSelectedConversation(conversation);

    // Mark all unread messages in this conversation as read
    // Check if we're in the browser before accessing localStorage
    if (typeof window === 'undefined') return;

    const currentUserId = localStorage.getItem('userId');
    const unreadMessages = conversation.messages.filter(
      msg => msg.recipientId._id === currentUserId && !msg.isRead
    );

    for (const msg of unreadMessages) {
      await markAsRead(msg._id);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await messageAPI.markAsRead(messageId);

      setMessages(prev =>
        prev.map(msg =>
          msg._id === messageId
            ? { ...msg, isRead: true, status: 'read' as const }
            : msg
        )
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return;

    try {
      const response = await messageAPI.replyToMessage(
        selectedConversation.lastMessage._id,
        messageInput.trim()
      );

      if (response.success) {
        setMessageInput('');
        fetchMessages();
        toast.success('Message sent');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const searchUsersForMessaging = async (search: string, role: string) => {
    try {
      const response = await messageAPI.searchUsers({
        search,
        role: role !== 'all' ? role : undefined,
        limit: 20
      });

      if (response.success) {
        setUsers(response.users || []);
        setShowUserDropdown(true);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleComposeMessage = async () => {
    if (
      !composeForm.recipientId ||
      !composeForm.subject ||
      !composeForm.content
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const response = await messageAPI.sendMessage({
        recipientId: composeForm.recipientId,
        subject: composeForm.subject,
        content: composeForm.content,
        priority: composeForm.priority,
        category: composeForm.category
      });

      if (response.success) {
        toast.success('Message sent successfully');
        setComposeForm({
          recipientId: '',
          recipientName: '',
          subject: '',
          content: '',
          priority: 'medium',
          category: 'general'
        });
        setShowNewMessageModal(false);
        fetchMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleArchive = async (messageId: string) => {
    try {
      const response = await messageAPI.archiveMessage(messageId);
      if (response.success) {
        toast.success('Message archived');
        fetchMessages();
      }
    } catch (error) {
      console.error('Error archiving message:', error);
      toast.error('Failed to archive message');
    }
  };

  const handleFlag = async (messageId: string) => {
    try {
      const response = await messageAPI.flagMessage(messageId);
      if (response.success) {
        toast.success('Message flagged');
        fetchMessages();
      }
    } catch (error) {
      console.error('Error flagging message:', error);
      toast.error('Failed to flag message');
    }
  };

  const handleDelete = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this conversation?')) return;

    try {
      const response = await messageAPI.deleteMessage(messageId);
      if (response.success) {
        toast.success('Message deleted');
        setSelectedConversation(null);
        fetchMessages();
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7)
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'employer':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'applicant':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Safe localStorage access - only in browser
  const currentUserId =
    typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-float"></div>
          <div
            className="absolute top-40 right-20 w-72 h-72 bg-purple-300/15 rounded-full blur-3xl animate-float"
            style={{ animationDelay: '2s' }}></div>
        </div>
        <div className="flex items-center justify-center h-full relative z-10">
          <div className="flex flex-col items-center gap-4 bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-gray-600 font-medium">Loading messages...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute top-40 right-20 w-72 h-72 bg-purple-300/15 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '2s' }}></div>
        <div
          className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-white/50 shadow-lg relative z-10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Messages
              </h1>
              <p className="text-sm text-gray-600">Admin messaging center</p>
            </div>
          </div>
          <Button
            onClick={() => setShowNewMessageModal(true)}
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
            <Plus className="h-4 w-4 mr-2" />
            New Message
          </Button>
        </div>
      </header>

      {/* Main Messenger Layout */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Left Sidebar - Conversations List */}
        <div className="w-80 border-r border-white/50 bg-white/60 backdrop-blur-xl flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-white/30">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search conversations..."
                className="pl-10 bg-white/80 border-white/50 focus:bg-white"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <Mail className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">
                  No conversations yet
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Start a new conversation with a user
                </p>
                <Button
                  onClick={() => setShowNewMessageModal(true)}
                  size="sm"
                  variant="outline"
                  className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  New Message
                </Button>
              </div>
            ) : (
              filteredConversations.map(conversation => (
                <div
                  key={conversation.userId}
                  onClick={() => selectConversation(conversation)}
                  className={`flex items-start gap-3 p-4 cursor-pointer hover:bg-white/60 transition-all border-b border-white/30 ${
                    selectedConversation?.userId === conversation.userId
                      ? 'bg-blue-50/80 border-l-4 border-l-blue-500'
                      : ''
                  }`}>
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                        {getInitials(conversation.userName)}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 h-5 w-5 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-bold">
                          {conversation.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {conversation.userName}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatTime(conversation.lastMessage.createdAt)}
                      </span>
                    </div>
                    <p
                      className={`text-sm truncate ${
                        conversation.unreadCount > 0
                          ? 'text-gray-900 font-medium'
                          : 'text-gray-500'
                      }`}>
                      {conversation.lastMessage.content}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="outline"
                        className={`text-xs px-1.5 py-0.5 h-5 ${getRoleBadgeColor(
                          conversation.userRole
                        )}`}>
                        {conversation.userRole}
                      </Badge>
                      {conversation.lastMessage.priority !== 'medium' && (
                        <Badge
                          className={`text-xs px-1.5 py-0.5 h-5 ${getPriorityColor(
                            conversation.lastMessage.priority
                          )}`}>
                          {conversation.lastMessage.priority}
                        </Badge>
                      )}
                      {conversation.lastMessage.isFlagged && (
                        <Flag className="h-3 w-3 text-red-500" />
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side - Chat View */}
        <div className="flex-1 flex flex-col bg-white/40 backdrop-blur-sm">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="bg-white/80 backdrop-blur-xl border-b border-white/50 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                        {getInitials(selectedConversation.userName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-semibold text-gray-900">
                          {selectedConversation.userName}
                        </h2>
                        <Badge
                          variant="outline"
                          className={`text-xs ${getRoleBadgeColor(
                            selectedConversation.userRole
                          )}`}>
                          {selectedConversation.userRole}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        {selectedConversation.userEmail}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="rounded-full">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="rounded-full">
                      <Video className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-full">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            handleArchive(selectedConversation.lastMessage._id)
                          }>
                          <Archive className="h-4 w-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleFlag(selectedConversation.lastMessage._id)
                          }>
                          <Flag className="h-4 w-4 mr-2" />
                          Flag
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleDelete(selectedConversation.lastMessage._id)
                          }
                          className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {selectedConversation.messages.map((message, index) => {
                  const isOwnMessage = message.senderId._id === currentUserId;
                  const showAvatar =
                    index === 0 ||
                    selectedConversation.messages[index - 1].senderId._id !==
                      message.senderId._id;

                  return (
                    <div
                      key={message._id}
                      className={`flex items-end gap-2 ${
                        isOwnMessage ? 'flex-row-reverse' : 'flex-row'
                      }`}>
                      {!isOwnMessage && showAvatar && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs font-semibold">
                            {getInitials(
                              `${message.senderId.firstName} ${message.senderId.lastName}`
                            )}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      {!isOwnMessage && !showAvatar && <div className="w-8" />}

                      <div
                        className={`max-w-[70%] ${
                          isOwnMessage ? 'items-end' : 'items-start'
                        }`}>
                        <div
                          className={`rounded-2xl px-4 py-2 ${
                            isOwnMessage
                              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                              : 'bg-white/80 backdrop-blur-sm border border-white/50 text-gray-900'
                          }`}>
                          {index === 0 ||
                          selectedConversation.messages[index - 1].subject !==
                            message.subject ? (
                            <p className="text-xs font-semibold mb-1 opacity-90">
                              {message.subject}
                            </p>
                          ) : null}
                          <p className="text-sm whitespace-pre-wrap">
                            {message.content}
                          </p>
                        </div>
                        <div
                          className={`flex items-center gap-2 mt-1 px-2 ${
                            isOwnMessage ? 'justify-end' : 'justify-start'
                          }`}>
                          <span className="text-xs text-gray-500">
                            {formatMessageTime(message.createdAt)}
                          </span>
                          {isOwnMessage && (
                            <CheckCircle className="h-3 w-3 text-blue-600" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="bg-white/80 backdrop-blur-xl border-t border-white/50 px-6 py-4">
                <div className="flex items-end gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full h-10 w-10 p-0">
                    <Plus className="h-5 w-5 text-gray-500" />
                  </Button>
                  <div className="flex-1 bg-white/60 backdrop-blur-sm border border-white/50 rounded-3xl px-4 py-2 flex items-center gap-2">
                    <Textarea
                      value={messageInput}
                      onChange={e => setMessageInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Type a message..."
                      className="border-0 bg-transparent resize-none focus-visible:ring-0 focus-visible:ring-offset-0 max-h-32 min-h-[40px]"
                      rows={1}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full h-8 w-8 p-0">
                      <Smile className="h-4 w-4 text-gray-500" />
                    </Button>
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="rounded-full h-10 w-10 p-0 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No conversation selected
                </h3>
                <p className="text-gray-500">
                  Select a conversation to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Message Modal */}
      {showNewMessageModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-xl border-white/50 shadow-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  New Message
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowNewMessageModal(false);
                    setComposeForm({
                      recipientId: '',
                      recipientName: '',
                      subject: '',
                      content: '',
                      priority: 'medium',
                      category: 'general'
                    });
                  }}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Recipient Selector */}
              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient *</Label>
                {composeForm.recipientId ? (
                  <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <User className="h-4 w-4 text-blue-600" />
                    <span className="flex-1 text-sm font-medium text-gray-900">
                      {composeForm.recipientName}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setComposeForm(prev => ({
                          ...prev,
                          recipientId: '',
                          recipientName: ''
                        }))
                      }>
                      <XCircle className="h-4 w-4 text-gray-500" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-32 bg-white/60 border-white/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Roles</SelectItem>
                          <SelectItem value="applicant">Applicants</SelectItem>
                          <SelectItem value="employer">Employers</SelectItem>
                          <SelectItem value="admin">Admins</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          value={userSearch}
                          onChange={e => setUserSearch(e.target.value)}
                          placeholder="Search users by name or email..."
                          className="pl-10 bg-white/60 border-white/50"
                        />
                      </div>
                    </div>
                    {showUserDropdown && users.length > 0 && (
                      <Card className="max-h-48 overflow-y-auto bg-white/95 border-white/50">
                        <div className="divide-y">
                          {users.map(user => (
                            <div
                              key={user._id}
                              onClick={() => {
                                setComposeForm(prev => ({
                                  ...prev,
                                  recipientId: user._id,
                                  recipientName: `${user.firstName} ${user.lastName}`
                                }));
                                setShowUserDropdown(false);
                                setUserSearch('');
                                setUsers([]);
                              }}
                              className="p-3 hover:bg-blue-50 cursor-pointer transition-colors">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                                    {getInitials(
                                      `${user.firstName} ${user.lastName}`
                                    )}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900">
                                    {user.firstName} {user.lastName}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {user.email}
                                  </p>
                                </div>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${getRoleBadgeColor(
                                    user.role
                                  )}`}>
                                  {user.role}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={composeForm.subject}
                  onChange={e =>
                    setComposeForm(prev => ({
                      ...prev,
                      subject: e.target.value
                    }))
                  }
                  placeholder="Enter message subject"
                  className="bg-white/60 border-white/50"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={composeForm.priority}
                    onValueChange={value =>
                      setComposeForm(prev => ({
                        ...prev,
                        priority: value as any
                      }))
                    }>
                    <SelectTrigger className="bg-white/60 border-white/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={composeForm.category}
                    onValueChange={value =>
                      setComposeForm(prev => ({
                        ...prev,
                        category: value as any
                      }))
                    }>
                    <SelectTrigger className="bg-white/60 border-white/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="application">
                        Application Inquiry
                      </SelectItem>
                      <SelectItem value="billing">Billing</SelectItem>
                      <SelectItem value="feedback">Feedback</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={composeForm.content}
                  onChange={e =>
                    setComposeForm(prev => ({
                      ...prev,
                      content: e.target.value
                    }))
                  }
                  placeholder="Write your message here..."
                  className="bg-white/60 border-white/50"
                  rows={6}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowNewMessageModal(false);
                    setComposeForm({
                      recipientId: '',
                      recipientName: '',
                      subject: '',
                      content: '',
                      priority: 'medium',
                      category: 'general'
                    });
                  }}>
                  Cancel
                </Button>
                <Button
                  onClick={handleComposeMessage}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Helper function
function getPriorityColor(priority: string) {
  switch (priority) {
    case 'urgent':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'high':
      return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-700 border-green-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}
