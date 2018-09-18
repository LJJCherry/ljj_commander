// lib
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');

const dirPath = path.resolve(__dirname, '../../');

String.prototype.firstUpperCase = function () {
  return this.replace(/^\S/, s => s.toUpperCase());
};

function createContainerContent(fileName, content) {
  fs.mkdir(`containers/${fileName.firstUpperCase()}`, () => {
    fs.writeFile(`containers/${fileName.firstUpperCase()}/index.jsx`, content);
    fs.writeFile(`containers/${fileName.firstUpperCase()}/index.less`, '');
    console.log('create container success!');
  });
}

function createContainer(fileName) {
  console.log('dirPath', dirPath, __dirname);
  try {
    fs.readFile(`${dirPath}/templates/container.jsx`, (err, data) => {
      if (err) console.log(err);
      const response = ejs.render(data.toString(), { componentName: fileName.firstUpperCase() });
      if (!fs.existsSync('containers')) {
        fs.mkdirSync('containers');
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
    fs.writeFile(`routes/${fileName}.jsx`, content);
    let d = fs.readFileSync('routes/index.jsx', 'utf8');
    const reg = new RegExp(`\\b${fileName}\\b`);
    const res = d.match(reg);
    if (res === null) {
      const reg1 = new RegExp('(route\n)');
      d = d.replace(reg1, `$1import ${fileName} from './${fileName}';\n`);
      const reg2 = new RegExp('(routes = .{1}\n)');
      d = d.replace(reg2, `$1  ${fileName},\n`);
      fs.writeFile('routes/index.jsx', d);
    } else {
      console.log('路由名已经存在');
    }
  } catch (err){
    console.log(err);
  }
}

function createRoute(fileName, moduleName) {
  try {
    fs.readFile(`${dirPath}/templates/route.js`, (err, data) => {
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
