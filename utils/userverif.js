const fs = require('fs');
const { addNewUser }=require('./addnewuser')


let registerdata=JSON.parse(fs.readFileSync('./data/register.json','utf-8'));

async function userVerification(){
    for (const userId in registerdata) {
        if (registerdata.hasOwnProperty(userId)) { // 确保只遍历对象自身的属性
          const user = registerdata[userId];
          if (user.approvalStatus === "pending") {
             await addNewUser(user)
             registerdata[userId].approvalStatus='approved'
             registerdata[userId].file=`${user.name}.md`
          }
        }
      }

  const registertext=JSON.stringify(registerdata,null,2)

  fs.writeFile("./data/register.json", registertext, (err) => {
    if (err) {
      console.error("写入文件时出错:", err);
      return;
    }
    console.log("数据审核完毕，数据已成功写入到register.json");
  });
}

module.exports = {
  userVerification
  };