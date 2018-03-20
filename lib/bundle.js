/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const DOMNodeCollection = __webpack_require__(1);

const callbacks = []
let documentReady = false

window.$l = function(selector){
  switch(typeof selector){
    case "function":
      return addCallback(selector);
    case "string":
      return retrieveNodes(selector);
    case "object":
      if(selector instanceof HTMLElement){
        return new DOMNodeCollection([selector])
      }
  }
};

$l.extend = (...args)=>{
  let result = args[0];
  args.slice(1).forEach((arg)=>{
    Object.keys(arg).forEach((key)=>{
      result[key] = arg[key] || result[key];
    });
  });
  return result;
};

$l.ajax = (opts) => {
  const xhr = new XMLHttpRequest();
  const defaults = {
    url:"",
    method:'GET',
    data:{},
    contentType:'application/x-www-form-urlencoded; charset=UTF-8',
    success:()=>{},
    error:()=>{}
  }
  const options = $l.extend(defaults, opts);
  options.method = options.method.toUpperCase();
  if(options.method === 'GET'){
    options.url  += `?${toQueryString(options.data)}`
  }

  xhr.open(options.method, options.url, true);
  xhr.onload = (e) => {
    if (xhr.status === 200) {
      options.success(xhr.response);
    }else{
      options.error(xhr.response);
    }
  }
  xhr.send(JSON.stringify(options.data));
};

// helper methods

toQueryString = (obj) =>{
  let result = '';
  for(const prop in obj){
    if (Object.prototype.hasOwnProperty.call(obj,prop)){
      result += `${prop}=${obj[prop]}&`;
    }
  }
  return result.substring(0, result.length-1)
}

addCallback = (func) =>{
  if(!documentReady){
    callbacks.push(func)
  }else{
    func()
  }
};

retrieveNodes = (selector) =>{
  const nodes = document.querySelectorAll(selector);
  const nodesArr = Array.from(nodes);
  return new DOMNodeCollection(nodesArr);
};

document.addEventListener('DOMContentLoaded', ()=>{
  documentReady = true;
  callbacks.forEach(func => func())
});


/***/ }),
/* 1 */
/***/ (function(module, exports) {

class DOMNodeCollection {
  constructor(HTMLarr) {
    this.htmlArr = HTMLarr;
  }

  // if this receives an argument it sets the argument to the inner HTML
  // of each node. Otherwise it returns the inner HTML of the first node
  html (string) {
    if (typeof string === "undefined") {
      return this.htmlArr[0].innerHTML;
    } else {
      this.htmlArr.forEach ( (el) => {
        el.innerHTML = string;
      });
    }
  }

// clears the content of all nodes by setting inner html to an empty string
  empty(){
    this.html('');
  }


  append(arg){
    if(typeof arg === "string"){
      this.htmlArr.forEach ( (el) => {
        el.innerHTML += arg;
      });
    } else if ( arg instanceof HTMLElement ) {
      this.htmlArr.forEach ( (el) => {
        el.innerHTML += arg.outerHTML;
      });
    } else {
      this.htmlArr.forEach ( (el) => {
        arg.each ( (index, el2) => {
          el.innerHTML += el2.outerHTML;
        });
      });
    }
  }

  attr(property) {
    return this.htmlArr[0].attributes[`${property}`].nodeValue;
  }

  addClass(newClass) {
    this.htmlArr.forEach ((el) => {
      el.attributes.class.nodeValue += ` ${newClass}`;
    });
  }

  removeClass(arg){
    if(typeof arg === "string"){
      const removeClasses = arg.split(' ');
      removeClasses.forEach((el)=>{
        this.htmlArr.forEach((el2)=>{
          el2.classList.remove(el);
        });
      });
    }else if (typeof arg === "undefined"){
      this.htmlArr.forEach ((el) => {
        el.attributes.class.nodeValue = '';
      });
    }
  }

  children(){
    const results = [];
    this.htmlArr.forEach((el)=>{  
      for (let i = 0; i < el.children.length; i++){
        results.push(el.children[i]);
      }
    });
    return new DOMNodeCollection(results);
  }

  parent() {
    const results = [];
    this.htmlArr.forEach((el)=>{
      const parent = el.parentNode;
      if (results.indexOf(parent) === -1) {
        results.push(parent);
      }
    });
    return new DOMNodeCollection(results);
  }

  find(selector) {
    const results =[];
    this.htmlArr.forEach((el)=>{
      const findRes = el.querySelectorAll(selector);
      for (let i = 0; i < findRes.length; i++) {
        results.push(findRes[i]);
      }
    });
    return new DOMNodeCollection(results);
  }

  remove(selector){
    if(typeof selector === 'undefined'){
      this.htmlArr.forEach ( el => {
        el.remove();
      });
    } else{
      let removable = this.find(selector);
      removable.htmlArr.forEach ( el => {
        el.remove();
      });
    }
  }

  on(type, callback){
    this.htmlArr.forEach((el)=>{
      el.addEventListener(type, callback);
      if(el.funcs){
        el.funcs.push(callback);
      }else{ el.funcs = [callback];}
    });
  }

  off(type, callback){
    this.htmlArr.forEach((el)=>{
      if(typeof callback === 'undefined'){
        el.funcs.forEach (el2 => {
          el.removeEventListener(type, el2);
        });
      } else {
        el.removeEventListener(type, callback);
      }
    });
  }
}

module.exports = DOMNodeCollection;


/***/ })
/******/ ]);