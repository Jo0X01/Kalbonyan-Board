class Helper {
    // Get Element by ID
    static gid = (id, ele = document) => ele.getElementById(id);
    // Get Elements by Class Name
    static gcls = (className, ele = document) => ele.querySelectorAll(`.${className}`);
    // to log in console
    static log = (...data) => console.log(data.length == 1 ? data[0] : data);
    // Create Element By ID and Class
    static cele = (tag, cls, id, value = "") => {
        tag = document.createElement(tag);
        tag.className = cls;
        tag.id = id;
        if (value)
            tag.innerHTML = value
        return tag;
    };
    // Add Evenet to Element
    static addEvent = (ele, action, handler, get_elemnt = false) => {
        if (get_elemnt) {
            ele = Helper.gid(ele)
        }
        ele.addEventListener(action, handler);
    }
    // Check if object is array
    static isArray = (ele) => Array.isArray(ele);
    // Convert object or array to iterator format
    static toIterator = (element) => {
        let lst = [];
        // If input is an array, use it directly, else convert object to array
        element = Helper.isArray(element) ? element : Object.entries(element);
        // Loop through each key-value pair in array and add to list if not null
        for (var i = 0; i < element.length; i++) {
            if (element[i]) {
                lst.push(element[i]);
            }
        }
        return lst;
    };
    // Iterate over an object or array and call handler function on each key-value pair
    static iter = (element, handler) => {
        // Convert to iterator format if not already in that format
        (Helper.isArray(element) ? element : Helper.toIterator(element)).forEach(
            ([key, value]) => handler(key, value)
        );
    };
    // Generate a unique ID string
    static getUniqID = () =>
        Date.now().toString(36) +
        Math.random().toString(36).substr(2) +
        Math.random().toString(36).substr(2) +
        Math.random().toString(36).substr(2) 

    // Append Children to Parent Element
    static pushChildren = (parent, children) => {
        try {
            children.length;
        } catch (e) {
            children = [children];
        }
        children.forEach((child) => parent.appendChild(child));
        return parent;
    };
}
class Storage {
    // Save a value to local storage with a given ID
    static saveToStorage = (id, value) => {
        window.localStorage.setItem(id, value);
        Helper.log('sv', id); // log the save operation
    }
    // Get a value from local storage with a given ID
    static getFromStorage = (id) => window.localStorage.getItem(id)
    // Get all values from local storage as an iterator
    static getAllStorage = () => Helper.toIterator(window.localStorage)
    // Swap the value of an old key with a new key
    static swapDataStorag = (oldKey, newKey) => {
        let keys = Storage.getAllStorage()
        Storage.clear()
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i][0]
            let value = keys[i][1]
            if (oldKey === key)
                key = newKey
            Storage.saveToStorage(key, value)
        }
        Helper.log('swp', oldKey, newKey); // log the swap operation
    }
    // Remove a value from local storage with a given ID
    static removeStorage = (id) => {
        window.localStorage.removeItem(id);
        Helper.log('rm', id); // log the removal operation
    }
    // Remove all values from local storage
    static clear = () => {
        window.localStorage.clear();
        Helper.log("Storage Cleared"); // log the clear operation
    }
}
