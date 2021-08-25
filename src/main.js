const fs = require("fs");
const readline = require("readline");

const defaultFile = readline.createInterface({
  input: fs.createReadStream("./default.less"),
});

const getStr = (str, start, end) => {
  str = str + " ";
  let res = str.match(new RegExp(`${start}(.*?)${end}`, "g"));
  return res ? res : "";
};

const defaultJson = {};

const replaceRegFun = (str) => {
  let newStr = str.trim();
  const resValueList = getStr(newStr, "@", " ");
  let flag = true;
  for (let i = 0; i < resValueList.length; i++) {
    let resValue = resValueList[i].trim();
    if (resValue && defaultJson[`${resValue}`]) {
      newStr = newStr.replace(`${resValue}`, defaultJson[`${resValue}`]);
    } else {
      flag = false;
    }
  }
  if (flag) return newStr;
  else return false;
};

var i = 1; //txt中的行数
defaultFile.on("line", function (line) {
  if (line.indexOf(":") !== -1) {
    const newLine = line.split(";")[0];
    let flag = false;
    const spList = newLine.split(":");
    const key = spList[0];
    let value = spList[1];
    if (value.indexOf("px") !== -1) {
      value = value.replace(/px/g, " * 2px");
      flag = true;
    }
    if (value.indexOf("@") !== -1) {
      const newValue = replaceRegFun(value);
      if (newValue) {
        flag = true;
        value = newValue;
      } else {
        flag = false;
      }
    }
    if (flag) {
      defaultJson[key] = value;
    }
  }
  i += 1;
});

defaultFile.on("close", () => {
  fs.writeFileSync("./default.json", JSON.stringify(defaultJson), "utf-8");
});
