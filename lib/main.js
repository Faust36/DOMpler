const DOMNodeCollection = require("./dom_node_collection.js");

Window.prototype.$l = function(selector){
  const arrMatches = [];
  let functions = [];
  if(typeof selector === 'string'){
    let elementList = document.querySelectorAll(selector);
    elementList.forEach((el)=>{
      arrMatches.push(el);
    });
    return new DOMNodeCollection(arrMatches); 
  } else if (selector instanceof HTMLElement ) {
    arrMatches.push(selector);
    return new DOMNodeCollection(arrMatches); 
  } else if(typeof selector === 'function'){
    functions.push(selector);
    if(document.readyState === 'complete'){
      functions.forEach((func)=>{
        func();
      });
      functions = [];
    }
  }
  document.onreadystatechange = ()=>{
    if(document.readyState === 'complete'){
      functions.forEach((func)=>{
        func();
      });
      functions = [];
    }
  };
  
  // extend = function (...args){
  //   let result = args[0];
  //   args.slice(1).forEach((arg)=>{
  //     arg.keys.forEach((key)=>{
  //       result[key] = arg[key] || result[key];
  //     });
  //   });
  //   return result;
  // };
};

$l.__proto__.extend = (...args)=>{
  // debugger
  let result = args[0];
  args.slice(1).forEach((arg)=>{
    Object.keys(arg).forEach((key)=>{
      result[key] = arg[key] || result[key];
    });
  });
  return result;
};

$l.__proto__.ajax = (opts) => {
  
};