import 'dotenv/config';
import { db } from './index';
import { users, posts, follows, likes, comments } from './schema';
import { seedUsers, seedPosts, seedFollows, seedLikes, seedComments } from './data'; 
import bcrypt from 'bcryptjs';

async function seed() {
  try {
    console.log('Starting database seed...\n');

    // bersiin data yg ada 
    console.log('Clearing existing data...');
    await db.delete(comments);
    await db.delete(likes);
    await db.delete(follows);
    await db.delete(posts);
    await db.delete(users);
    console.log('All existing data cleared successfully\n');

    const createdUsers = [];
    const createdPosts = [];

    // seed user klo usernya ada
    if (seedUsers.length > 0) {
      console.log('Seeding users...');
      for (const user of seedUsers) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const [createdUser] = await db
          .insert(users)
          .values({
            username: user.username,
            email: user.email,
            password: hashedPassword,
            displayName: user.displayName,
            bio: user.bio,
          })
          .returning();
        createdUsers.push(createdUser);
        console.log(`  > Created user: ${user.username}`);
      }
    }

    // seed posts klo ada user dan data post)
    if (createdUsers.length > 0 && seedPosts.length > 0) {
      console.log('\nSeeding posts...');
      for (const post of seedPosts) {
        const [createdPost] = await db
          .insert(posts)
          .values({
            userId: createdUsers[post.userIndex].id,
            content: post.content,
          })
          .returning();
        createdPosts.push(createdPost);
        console.log(`  > Created post by ${createdUsers[post.userIndex].username}`);
      }
    }

    // seed follow klo ada user dan follow
    let followCount = 0;
    if (createdUsers.length > 0 && seedFollows.length > 0) {
      console.log('\nSeeding follows...');
      for (const follow of seedFollows) {
        await db.insert(follows).values({
          followerId: createdUsers[follow.followerIndex].id,
          followingId: createdUsers[follow.followingIndex].id,
        });
        followCount++;
      }
    }

    // seed like klo ada user dan like
    let likeCount = 0;
    if (createdPosts.length > 0 && seedLikes.length > 0) {
      console.log('\nSeeding likes...');
      for (const like of seedLikes) {
        await db.insert(likes).values({
          userId: createdUsers[like.userIndex].id,
          postId: createdPosts[like.postIndex].id,
        });
        likeCount++;
      }
    }

    // seed komen klo ada user dan komen
    let commentCount = 0;
    if (createdPosts.length > 0 && seedComments.length > 0) {
      console.log('\nSeeding comments...');
      for (const comment of seedComments) {
        await db.insert(comments).values({
          userId: createdUsers[comment.userIndex].id,
          postId: createdPosts[comment.postIndex].id,
          content: comment.content,
        });
        commentCount++;
      }
    }

    console.log('\nSeeding completed successfully!');
    console.log('-------------------------');
    console.log(`Summary: ${createdUsers.length} Users, ${createdPosts.length} Posts, ${followCount} Follows created.`);
    
    process.exit(0);
  } catch (error) {
    console.error('\nError seeding database!');
    console.error(error);
    process.exit(1);
  }
}

seed();