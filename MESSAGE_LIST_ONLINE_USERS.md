# Message List - Online Users Feature

## Overview
Added a comprehensive user list to the messages page with real-time online status indicators and the ability to start conversations with any user.

## Changes Made

### Frontend Changes

#### 1. Socket Service (`socket.service.ts`)
**Added Features:**
- `onlineUsersSubject` - BehaviorSubject to track online user IDs
- `onlineUsers$` - Observable for components to subscribe to online users
- Listens for `user-online` and `user-offline` socket events
- Updates online users list in real-time

**Key Code:**
```typescript
private onlineUsersSubject = new BehaviorSubject<string[]>([]);
public onlineUsers$ = this.onlineUsersSubject.asObservable();

// Listen for user status changes
this.socket.on('user-online', (userId: string) => {
  const current = this.onlineUsersSubject.value;
  if (!current.includes(userId)) {
    this.onlineUsersSubject.next([...current, userId]);
  }
});

this.socket.on('user-offline', (userId: string) => {
  const current = this.onlineUsersSubject.value;
  this.onlineUsersSubject.next(current.filter(id => id !== userId));
});
```

#### 2. User Service (`user.service.ts`)
**Added Method:**
- `getAllUsers(limit?: number)` - Fetch all users for messaging

```typescript
getAllUsers(limit?: number): Observable<{ success: boolean; data: User[] }> {
  const params = limit ? { limit: limit.toString() } : {};
  return this.http.get<{ success: boolean; data: User[] }>(this.apiUrl, { params });
}
```

#### 3. Message Service (`message.service.ts`)
**Added Method:**
- `createConversation(userId: string)` - Create or get existing conversation

```typescript
createConversation(userId: string): Observable<{ success: boolean; data: Conversation }> {
  return this.http.post<{ success: boolean; data: Conversation }>(`${this.apiUrl}/conversations`, {
    participantId: userId
  });
}
```

#### 4. Conversations List Component (`conversations-list.component.ts`)
**Major Enhancements:**
- Added Material Tabs module for two-tab interface
- Tab 1: "Conversations" - Shows existing conversations
- Tab 2: "All Users" - Shows all users with online status
- Real-time online status tracking via socket subscription
- Search functionality for both tabs
- `startChatWithUser(userId)` method to initiate conversations

**New Properties:**
```typescript
allUsers: any[] = [];
filteredUsers: any[] = [];
onlineUserIds: string[] = [];
selectedTab = 0;
```

**Key Methods:**
```typescript
loadUsers(): void {
  this.userService.getAllUsers(100).subscribe({
    next: (response: any) => {
      this.allUsers = response.data || [];
      this.filteredUsers = this.allUsers;
    }
  });
}

subscribeToOnlineUsers(): void {
  const sub = this.socketService.onlineUsers$.subscribe(userIds => {
    this.onlineUserIds = userIds;
  });
  this.subscriptions.push(sub);
}

isUserOnline(userId: string): boolean {
  return this.onlineUserIds.includes(userId);
}

startChatWithUser(userId: string): void {
  this.messageService.createConversation(userId).subscribe({
    next: (response: any) => {
      const conversationId = response.data?._id || response._id;
      this.router.navigate(['/messages', conversationId]);
    }
  });
}
```

#### 5. Conversations List Template (`conversations-list.component.html`)
**New UI Structure:**
- Material Tab Group with two tabs
- Online status badges with pulsing animation
- "Chat" button for each user in the All Users tab
- Improved empty states for both tabs

**Key Features:**
```html
<mat-tab-group [(selectedIndex)]="selectedTab" (selectedIndexChange)="onTabChange($event)">
  <mat-tab label="Conversations">
    <!-- Existing conversations with online status badges -->
    <mat-chip *ngIf="isUserOnline(conv.otherUser._id)" class="online-badge">Online</mat-chip>
  </mat-tab>

  <mat-tab label="All Users">
    <!-- All users list with online status and chat buttons -->
    <mat-chip *ngIf="isUserOnline(user._id)" class="online-badge">
      <mat-icon>circle</mat-icon>
      Online
    </mat-chip>
    <button mat-raised-button color="primary" (click)="startChatWithUser(user._id)">
      <mat-icon>chat</mat-icon>
      Chat
    </button>
  </mat-tab>
</mat-tab-group>
```

#### 6. Conversations List Styles (`conversations-list.component.scss`)
**New Styles:**
- `.message-tabs` - Tab container styling
- `.users-list` - User list item styling
- `.online-badge` - Green badge with pulsing icon animation
- `.chat-button` - Styled chat button

**Online Badge Animation:**
```scss
.online-badge {
  height: 20px;
  padding: 0 8px;
  font-size: 0.7rem;
  background: #4caf50;
  color: white;
  border-radius: 10px;
  
  mat-icon {
    font-size: 10px;
    animation: pulse 2s ease-in-out infinite;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

### Backend Changes

#### 1. User Controller (`user.controller.ts`)
**Added Function:**
- `getAllUsers()` - Returns list of all users (excluding current user)

```typescript
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const currentUserId = (req as any).user?.userId;

    const users = await User.find({ _id: { $ne: currentUserId } })
      .select('_id name email avatar role isVerified createdAt')
      .limit(limit)
      .sort({ name: 1 });

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
};
```

#### 2. User Routes (`user.routes.ts`)
**Added Route:**
```typescript
router.get('/', authenticate, getAllUsers); // GET /api/users
```

#### 3. Message Controller (`message.controller.ts`)
**Added Function:**
- `createConversation()` - Creates new conversation or returns existing one

```typescript
export const createConversation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const { participantId } = req.body;

    // Generate conversation ID
    const conversationId = generateConversationId(userId, participantId);

    // Check if conversation already exists
    const existingMessage = await Message.findOne({ conversationId })
      .sort({ createdAt: -1 })
      .populate([
        { path: 'senderId', select: 'name email avatar' },
        { path: 'receiverId', select: 'name email avatar' }
      ]);

    if (existingMessage) {
      // Return existing conversation
      return res.json({
        success: true,
        data: {
          _id: conversationId,
          participants: [existingMessage.senderId, existingMessage.receiverId],
          lastMessage: existingMessage,
          unreadCount: 0
        }
      });
    }

    // Create initial conversation marker
    const initialMessage = await Message.create({
      conversationId,
      senderId: userId,
      receiverId: participantId,
      content: '',
      read: true
    });

    await initialMessage.populate([
      { path: 'senderId', select: 'name email avatar' },
      { path: 'receiverId', select: 'name email avatar' }
    ]);

    res.status(201).json({
      success: true,
      data: {
        _id: conversationId,
        participants: [initialMessage.senderId, initialMessage.receiverId],
        lastMessage: initialMessage,
        unreadCount: 0
      }
    });
  } catch (error) {
    next(error);
  }
};
```

#### 4. Message Routes (`message.routes.ts`)
**Added Route:**
```typescript
router.post('/conversations', createConversation); // POST /api/messages/conversations
```

#### 5. Socket Chat Handler (`chat.socket.ts`)
**Already Implemented:**
- Tracks online users in a Map: `onlineUsers: Map<string, string>`
- Broadcasts `user-online` event when user connects
- Broadcasts `user-offline` event when user disconnects
- Sends current online users list to newly connected users

```typescript
// On connection
onlineUsers.set(socket.userId, socket.id);
io.emit('user-online', {
  userId: socket.userId,
  timestamp: new Date()
});
const onlineUserIds = Array.from(onlineUsers.keys());
socket.emit('online-users', onlineUserIds);

// On disconnect
onlineUsers.delete(socket.userId);
io.emit('user-offline', {
  userId: socket.userId,
  timestamp: new Date()
});
```

## Features

### ✅ Real-Time Online Status
- Green "Online" badge appears next to users who are currently connected
- Pulsing circle icon animation for visual feedback
- Updates in real-time as users connect/disconnect

### ✅ Two-Tab Interface
1. **Conversations Tab**: Shows existing chat conversations
2. **All Users Tab**: Shows all registered users with chat options

### ✅ Start New Conversations
- Click "Chat" button next to any user to start a conversation
- Automatically creates conversation or navigates to existing one
- Seamless navigation to chat interface

### ✅ Smart Search
- Search functionality adapts to selected tab
- Search conversations by user name
- Search users by name or email

### ✅ Visual Feedback
- Empty states for both tabs
- Loading indicators
- Smooth animations and transitions
- Material Design 3 styling

## API Endpoints

### GET `/api/users`
**Description:** Get all users (excluding current user)
**Authentication:** Required
**Query Parameters:**
- `limit` (optional, default: 50) - Maximum number of users to return

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "userId",
      "name": "User Name",
      "email": "user@example.com",
      "avatar": "https://...",
      "role": "tourist",
      "isVerified": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### POST `/api/messages/conversations`
**Description:** Create a new conversation or get existing one
**Authentication:** Required
**Body:**
```json
{
  "participantId": "userId"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "conversationId",
    "participants": [/* user objects */],
    "lastMessage": {/* message object */},
    "unreadCount": 0
  }
}
```

## Socket Events

### Client Receives:
- `online-users` - Array of online user IDs (sent on connection)
- `user-online` - User ID when someone connects
- `user-offline` - User ID when someone disconnects

### Client Emits:
- No new events (connection automatically triggers online status)

## Usage

1. Navigate to `/messages`
2. Switch to "All Users" tab
3. See all users with online status indicators
4. Click "Chat" button next to any user
5. Start messaging immediately

## Testing Checklist

- [ ] Online status badge appears for connected users
- [ ] Badge disappears when users disconnect
- [ ] Search works in both tabs
- [ ] Clicking "Chat" creates/opens conversation
- [ ] Tab switching preserves data
- [ ] Empty states display correctly
- [ ] Animations work smoothly
- [ ] Mobile responsive design

## Next Steps

1. Add typing indicators in user list
2. Add "last seen" timestamp for offline users
3. Add user profile preview on hover
4. Add bulk actions (mute, block, etc.)
5. Add conversation archiving

## Dependencies

**Frontend:**
- `@angular/material` - Tabs, chips, buttons
- `socket.io-client` - Real-time communication
- `rxjs` - Reactive state management

**Backend:**
- `socket.io` - WebSocket server
- `mongoose` - Database queries

## Notes

- Online status updates in real-time using Socket.IO
- Conversation IDs are deterministic (generated from user IDs)
- Users excluded from their own list in "All Users" tab
- Initial conversation messages are empty (markers only)
- System handles duplicate conversation creation attempts
