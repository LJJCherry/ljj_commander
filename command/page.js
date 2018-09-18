#!/usr/bin/env node
'use strict'

const { prompt } = require('inquirer');
const path = require('path');
const createPage = require('../server/service/page');
const fs = require('fs');

const question = [
  {
    type: 'input',
    name: 'fileName',
    message: '文件名称（必填）：',
    validate (val) {
      if (val !== '') {
        return true
      }
      return '请填写文件名称'
    }
  },{
      type: 'input',
      name: 'moduleName',
      message: '模块名称（中文必填）：',
      validate (val) {
        if (val !== '') {
          return true
        }
        return '模块名称（中文必填）'
      }
  }
]

module.exports = () => {
  const fileList = fs.readdirSync(path.resolve('./'));
  // if (fileList.indexOf('App.js') === -1 || fileList.indexOf('containers') === -1) {
  //   console.log('请定位到项目src目录');
  // } else {
        prompt(question).then(function({fileName, moduleName}){
        createPage(fileName, moduleName);
    })
  // }
}
