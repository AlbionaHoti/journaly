# Migration `20210212180218-membership-subscription-model`

This migration has been generated by Robin MacPherson at 2/12/2021, 10:02:19 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "User" ALTER COLUMN "userRole" SET DEFAULT E'USER'
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20210102205203-add-pending-notification-table..20210212180218-membership-subscription-model
--- datamodel.dml
+++ datamodel.dml
@@ -1,44 +1,47 @@
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 generator prisma_client {
-  provider = "prisma-client-js"
+  provider      = "prisma-client-js"
+  binaryTargets = ["native", "rhel-openssl-1.0.x"]
 }
 model User {
-  id                       Int                       @id @default(autoincrement())
-  name                     String?
-  email                    String                    @unique
-  handle                   String                    @unique
-  auth                     Auth?
-  userRole                 UserRole                  @default(FREE_USER)
-  bio                      String?
-  city                     String?
-  country                  String?
-  posts                    Post[]
-  subscription             UserSubscription?
-  socialMedia              SocialMedia?
-  languagesNative          LanguageNative[]
-  languagesLearning        LanguageLearning[]
-  languages                LanguageRelation[]
-  createdAt                DateTime                  @default(now())
-  updatedAt                DateTime                  @updatedAt
-  userInterests            UserInterest[]
-  pageView                 PageView[]
-  profileImage             String?
-  threadSubscriptions      ThreadSubscription[]
-  postLikes                PostLike[]
-  commentThanks            CommentThanks[]
-  postCommentThanks        PostCommentThanks[]
-  comments                 Comment[]
-  postComments             PostComment[]
-  badges                   UserBadge[]
-  followedBy               User[]                    @relation("UserFollows", references: [id])
-  following                User[]                    @relation("UserFollows", references: [id])
-  postCommentSubscriptions PostCommentSubscription[]
+  id                                Int                                 @id @default(autoincrement())
+  name                              String?
+  email                             String                              @unique
+  handle                            String                              @unique
+  auth                              Auth?
+  userRole                          UserRole                            @default(USER)
+  bio                               String?
+  city                              String?
+  country                           String?
+  posts                             Post[]
+  subscription                      MembershipSubscription?
+  socialMedia                       SocialMedia?
+  languagesNative                   LanguageNative[]
+  languagesLearning                 LanguageLearning[]
+  languages                         LanguageRelation[]
+  createdAt                         DateTime                            @default(now())
+  updatedAt                         DateTime                            @updatedAt
+  userInterests                     UserInterest[]
+  pageView                          PageView[]
+  profileImage                      String?
+  threadSubscriptions               ThreadSubscription[]
+  postLikes                         PostLike[]
+  commentThanks                     CommentThanks[]
+  postCommentThanks                 PostCommentThanks[]
+  comments                          Comment[]
+  postComments                      PostComment[]
+  badges                            UserBadge[]
+  followedBy                        User[]                              @relation("UserFollows", references: [id])
+  following                         User[]                              @relation("UserFollows", references: [id])
+  postCommentSubscriptions          PostCommentSubscription[]
+  PendingNotification               PendingNotification[]
+  MembershipSubscriptionTransaction MembershipSubscriptionTransaction[]
 }
 model Auth {
   id               Int     @id @default(autoincrement())
@@ -123,8 +126,9 @@
   threads                  Thread[]
   postTopics               PostTopic[]
   postComments             PostComment[]
   postCommentSubscriptions PostCommentSubscription[]
+  PendingNotification      PendingNotification[]
 }
 model Language {
   id            Int                @id @default(autoincrement())
@@ -197,8 +201,9 @@
   authorId  Int
   comment   Comment  @relation(fields: [commentId], references: [id])
   commentId Int
+  PendingNotification PendingNotification[]
   @@unique([authorId, commentId])
 }
 model PostCommentThanks {
@@ -208,33 +213,36 @@
   authorId      Int
   PostComment   PostComment? @relation(fields: [postCommentId], references: [id])
   postCommentId Int?
+  PendingNotification PendingNotification[]
   @@unique([authorId, postCommentId])
 }
 model Comment {
-  id        Int             @id @default(autoincrement())
-  createdAt DateTime        @default(now())
-  updatedAt DateTime        @updatedAt
-  body      String
-  author    User            @relation(fields: [authorId], references: [id])
-  authorId  Int
-  thread    Thread          @relation(fields: [threadId], references: [id])
-  threadId  Int
-  thanks    CommentThanks[]
+  id                  Int                   @id @default(autoincrement())
+  createdAt           DateTime              @default(now())
+  updatedAt           DateTime              @updatedAt
+  body                String
+  author              User                  @relation(fields: [authorId], references: [id])
+  authorId            Int
+  thread              Thread                @relation(fields: [threadId], references: [id])
+  threadId            Int
+  thanks              CommentThanks[]
+  PendingNotification PendingNotification[]
 }
 model PostComment {
-  id        Int                 @id @default(autoincrement())
-  createdAt DateTime            @default(now())
-  updatedAt DateTime            @updatedAt
-  body      String
-  author    User                @relation(fields: [authorId], references: [id])
-  authorId  Int
-  post      Post                @relation(fields: [postId], references: [id])
-  postId    Int
-  thanks    PostCommentThanks[]
+  id                  Int                   @id @default(autoincrement())
+  createdAt           DateTime              @default(now())
+  updatedAt           DateTime              @updatedAt
+  body                String
+  author              User                  @relation(fields: [authorId], references: [id])
+  authorId            Int
+  post                Post                  @relation(fields: [postId], references: [id])
+  postId              Int
+  thanks              PostCommentThanks[]
+  PendingNotification PendingNotification[]
 }
 model Thread {
   id                 Int                  @id @default(autoincrement())
@@ -285,18 +293,28 @@
   @@unique([userId, postId])
 }
-model UserSubscription {
-  id        Int      @id @default(autoincrement())
-  name      String
+model MembershipSubscription {
+  id        Int                        @id @default(autoincrement())
+  type      MembershipSubscriptionType
   price     Int
-  user      User     @relation(fields: [userId], references: [id])
+  user      User                       @relation(fields: [userId], references: [id])
   userId    Int
-  createdAt DateTime @default(now())
-  updatedAt DateTime @updatedAt
+  expiresAt DateTime?
+  createdAt DateTime                   @default(now())
+  updatedAt DateTime                   @updatedAt
 }
+model MembershipSubscriptionTransaction {
+  id          Int      @id @default(autoincrement())
+  chargeCents Int
+  user        User     @relation(fields: [userId], references: [id])
+  userId      Int
+  createdAt   DateTime @default(now())
+  updatedAt   DateTime @updatedAt
+}
+
 model PageView {
   id                  Int      @id @default(autoincrement())
   user                User?    @relation(fields: [userId], references: [id])
   userId              Int?
@@ -319,13 +337,13 @@
   @@unique([userId, type])
 }
 model PendingNotification {
-  id                  Int                @id @default(autoincrement())
-  type                NotificationType
-  createdAt           DateTime           @default(now())
-  user                User               @relation(fields: [userId], references: [id])
-  userId              Int
+  id        Int              @id @default(autoincrement())
+  type      NotificationType
+  createdAt DateTime         @default(now())
+  user      User             @relation(fields: [userId], references: [id])
+  userId    Int
   post                Post?              @relation(fields: [postId], references: [id])
   postId              Int?
   postCommentThanks   PostCommentThanks? @relation(fields: [postCommentThanksId], references: [id])
@@ -342,8 +360,9 @@
   ADMIN
   MODERATOR
   FREE_USER
   PRO_USER
+  USER
 }
 enum PostStatus {
   DRAFT
@@ -374,4 +393,11 @@
   THREAD_COMMENT_THANKS
   POST_COMMENT_THANKS
   NEW_POST
 }
+
+enum MembershipSubscriptionType {
+  MONTHLY
+  QUARTERLY
+  SEMIANNUALY
+  ANNUALY
+}
```

