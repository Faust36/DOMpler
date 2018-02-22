class DOMNodeCollection {
  constructor(HTMLarr) {
    this.htmlArr = HTMLarr;
  }
  
  html (string) {
    if (typeof string === "undefined") {
      return this.htmlArr[0].innerHTML;
    } else {
      this.htmlArr.forEach ( (el) => {
        el.innerHTML = string;
      });
    }
  }
  
  empty(){
    this.html('');
  }
  
  append(arg){
    if(typeof arg === "string"){
      this.htmlArr.forEach ( (el) => {
        el.innerHTML += arg;
        // $l(el).html($l(el).html() + arg);
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
      // results.push(new DOMNodeCollection(el.children));
      for (let i = 0; i < el.children.length; i++){
        results.push(el.children[i]);
      }
    });
    return new DOMNodeCollection(results);
  }
  
  parent() {
    const results = [];
    this.htmlArr.forEach((el)=>{
      // results.push(new DOMNodeCollection(el.children));
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