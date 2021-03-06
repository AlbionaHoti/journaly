# Migration `20201223171239-replace-location-model`

This migration has been generated by Robin MacPherson at 12/23/2020, 9:12:39 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "User" DROP CONSTRAINT "User_locationId_fkey"

ALTER TABLE "User" DROP COLUMN "locationId",
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT

DROP TABLE "Location"
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201223164158-add-language-dev-name..20201223171239-replace-location-model
--- datamodel.dml
+++ datamodel.dml
@@ -1,7 +1,7 @@
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 generator prisma_client {
   provider = "prisma-client-js"
@@ -14,13 +14,13 @@
   handle                   String                    @unique
   auth                     Auth?
   userRole                 UserRole                  @default(FREE_USER)
   bio                      String?
+  city                     String?
+  country                  String?
   posts                    Post[]
   subscription             UserSubscription?
   socialMedia              SocialMedia?
-  location                 Location?                 @relation(fields: [locationId], references: [id])
-  locationId               Int?
   languagesNative          LanguageNative[]
   languagesLearning        LanguageLearning[]
   languages                LanguageRelation[]
   createdAt                DateTime                  @default(now())
@@ -137,15 +137,8 @@
   LanguageRelation LanguageRelation[]
   @@unique([name, dialect])
 }
-model Location {
-  id      Int    @id @default(autoincrement())
-  country String
-  city    String
-  User    User[]
-}
-
 model Topic {
   id                Int                @id @default(autoincrement())
   devName           String
   userInterests     UserInterest[]
```


