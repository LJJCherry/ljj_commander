// lib
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');

const templatePath = path.resolve('templates');
const outPath = path.resolve('src');

String.prototype.firstUpperCase = function () {
  return this.replace(/^\S/, s => s.toUpperCase());
};

function createContainerContent(fileName, content) {
  fs.mkdir(`${outPath}/containers/${fileName.firstUpperCase()}`, () => {
    fs.writeFile(`${outPath}/containers/${fileName.firstUpperCase()}/index.jsx`, content, (err) => {if(err) console.log(err)});
    fs.writeFile(`${outPath}/containers/${fileName.firstUpperCase()}/index.less`, '', (err) => {if(err) console.log(err)});
    console.log('create container success!');
  });
}

function createContainer(fileName) {
  try {
    fs.readFile(`${templatePath}/container.jsx`, (err, data) => {
      if (err) console.log(err);
      const response = ejs.render(data.toString(), { componentName: fileName.firstUpperCase() });
      if (!fs.existsSync(`${outPath}/containers`)) {
        fs.mkdirSync(`${outPath}/containers`);
        createContainerContent(fileName, response);
      } else {
        createContainerContent(fileName, response);
      }
    });
  } catch (e) {
    console.log('create container failure!');
    console.log(e);
  }
}

function createRouteContent(fileName, moduleName, content) {
  try{
    fs.writeFileSync(`${outPath}/routes/${fileName}.jsx`, content);
    let d = fs.readFileSync(`${outPath}/routes/index.jsx`, 'utf8');
    const reg = new RegExp(`\\b${fileName}\\b`);
    const res = d.match(reg);
    if (res === null) {
      const reg1 = new RegExp('(route\n)');
      d = d.replace(reg1, `$1import ${fileName} from './${fileName}';\n`);
      const reg2 = new RegExp('(routes = .{1}\n)');
      d = d.replace(reg2, `$1  ${fileName},\n`);
      fs.writeFileSync(`${outPath}/routes/index.jsx`, d);
    } else {
      console.log('路由名已经存在');
    }
  } catch (err){
    console.log(err);
  }
}

function createRoute(fileName, moduleName) {
  try {
    fs.readFile(`${templatePath}/route.js`, (err, data) => {
      if (err) console.log(err);
      const response = ejs.render(data.toString(), {
        fileName: fileName.firstUpperCase(),
        moduleName,
      });
      if (!fs.existsSync('routes')) {
        fs.mkdirSync('routes');
        createRouteContent(fileName, moduleName, response);
      } else {
        createRouteContent(fileName, moduleName, response);
      }
    });
  } catch (e) {
    console.log('create container failure!');
    console.log(e);
  }
}

function createPage(fileName, moduleName) {
  createContainer(fileName);
  createRoute(fileName, moduleName);
}

module.exports = createPage;
