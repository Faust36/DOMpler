const DOMNodeCollection = require("./dom_node_collection.js");

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
