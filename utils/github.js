const { Octokit } = require("@octokit/rest");
require('dotenv').config();

// 从环境变量中获取 GitHub 配置
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_REG = process.env.GITHUB_REG;

if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO || !GITHUB_REG) {
  throw new Error("GitHub environment variables are not set");
}

// 初始化 Octokit 客户端
const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

/**
 * 读取 GitHub 仓库中的文件内容
 * @param {string} path 文件路径
 * @returns {Promise<string>} 文件内容（字符串）
 */
async function readFile(path) {
  try {
    const { data } = await octokit.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path,
    });

    if (data.type !== "file" || !data.content) {
      throw new Error("Path does not point to a valid file");
    }

    // 解码 Base64 内容
    return Buffer.from(data.content, "base64").toString("utf-8");
  } catch (error) {
    console.error("Error reading file:", error);
    throw error;
  }
}

/**
 * 更新 GitHub 仓库中的文件内容
 * @param {string} path 文件路径
 * @param {string} content 新的文件内容
 * @param {string} message 提交信息
 * @returns {Promise<void>} 更新结果
 */
async function updateFile(path, content, message = "Update file") {
  try {
    // 获取文件的当前 SHA（用于更新文件）
    const { data: fileData } = await octokit.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path,
    });

    if (fileData.type !== "file" || !fileData.sha) {
      throw new Error("Path does not point to a valid file");
    }

    // 更新文件内容
    await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path,
      message,
      content: Buffer.from(content).toString("base64"), // 编码为 Base64
      sha: fileData.sha, // 当前文件的 SHA
    });

    console.log("File updated successfully");
  } catch (error) {
    console.error("Error updating file:", error);
    throw error;
  }
}

async function createFile(path, content, message = "Create file") {
    try {
      // 创建新文件（直接使用 createOrUpdateFileContents）
      await octokit.repos.createOrUpdateFileContents({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        path,
        message,
        content: Buffer.from(content).toString("base64"), // 编码为 Base64
      });
  
      console.log("File created successfully");
    } catch (error) {
      // 检查错误是否是因为文件已存在
      if (error.status === 422 && error.response && error.response.data && error.response.data.message.includes("sha missing")) {
        console.error("File already exists:", error);
      } else {
        console.error("Error creating file:", error);
        throw error;
      }
    }
  }

module.exports = {
  readFile,
  updateFile,
  createFile
};