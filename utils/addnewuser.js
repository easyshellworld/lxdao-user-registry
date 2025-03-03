const fs = require('fs');
const { createFile } = require("./github");
const { error } = require('console');




function generateMarkdown(user) {
  return `---
timezone: ${user.timezone}
---

# ${user.name}

1. 自我介绍
   ${user.bio}
2. 你认为你会完成本次残酷学习吗？
   ${user.approvalStatus === 'approved' ? '已批准，加油！' : '待定'}
3. 你的联系方式（推荐 Telegram）
   Email: ${user.email}

## Notes

### 2025.07.11

笔记内容

### 2025.07.12

`;
}

async function addNewUser(user) {
  const markdownContent = generateMarkdown(user);

  try {
    await createFile(`${user.name}.md`, markdownContent, `New ${user.name}`);
    console.log(`New add ${user.name}`);
  } catch (error) {
    console.error(`Error adding ${user.name}:`, error);
    throw error; // 重新抛出错误，让调用者知道发生了错误
  }
}

module.exports = {
  addNewUser
};