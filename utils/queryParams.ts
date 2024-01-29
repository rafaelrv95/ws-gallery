export function getSearch(){
    if (typeof window !== "undefined") {
      // Client-side-only code
      let search = window.location.search.substring(1);
      let searchObj = JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g,'":"') + '"}', function(key, value) { return key===""?value:decodeURIComponent(value) })
      return searchObj
    }
    
  }

