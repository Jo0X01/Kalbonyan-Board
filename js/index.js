// Start Actions Section
edit_click = (event) => {
    parent = event.target.parentNode.parentNode
    parent.draggable = false
    input = parent.firstChild
    input.readOnly = false
    input.focus()
    input.select()
}
trsh_click = (event) => removeTask(event.target.parentNode.parentNode.id)
inputFocusOut = (event) => {
    e = event.target
    parent = e.parentNode
    e.readOnly = true
    parent.draggable = true
    Helper.log('edt', parent.id)
    Storage.saveToStorage(parent.id, e.value);
}
// End Actions Section

// Start Drag Events
hideSeprator = (ele) => {
    sep = ele.lastChild
    sep.style.height = "var(--sep-hide-height)";
    sep.style.background = "var(--sep-hide-bg)";
}
showSeprator = (ele) => {
    sep = ele.lastChild
    sep.style.height = "var(--sep-show-height)";
    sep.style.background = "var(--sep-show-bg-color)";
}
dragStart = (ele) => {
    // user start element dragged
    // save dragged element to drag var
    drag = ele;
    // hide sperator if is shown
    hideSeprator(ele)
}
dragEnd = (ele) => {
    // user left the dragged element
    drag = null; // Remove Dragged Element
    // hide seprator
    hideSeprator(ele);
}
dragOver = (event, ele) => {
    // if dragged element come to the new element
    // Show Seprator When Element over the parent 
    event.preventDefault(); // Stop Browser
    // Show Seprator
    showSeprator(ele)
}
dragLeave = (event, ele) => {
    event.preventDefault(); // Stop Browser
    // hide seprator
    hideSeprator(ele)
}
Drop = (ele) => {
    // main function that swap element in storage and page
    if (drag) {
        var oldInputId = drag.id;
        var newInputId = `${ele.id.split("-")[0]}-${oldInputId.split("-")[1]}`;
        if (oldInputId === ele.id) return;
        drag.id = newInputId; // change element id to the new list
        ele.after(drag); // move element to the list
        Storage.swapDataStorag(oldInputId, newInputId); // swap id in localStorage
    }
    // hide sperator
    hideSeprator(ele);
}
addDragEvent = ele => {
    drag = null;
    Helper.addEvent(ele, 'dragstart', () => dragStart(ele));
    Helper.addEvent(ele, 'dragend', () => dragEnd(ele));
    Helper.addEvent(ele, 'dragover', (event) => dragOver(event, ele));
    Helper.addEvent(ele, 'dragleave', (event) => dragLeave(event, ele));
    Helper.addEvent(ele, 'drop', () => Drop(ele));
    Helper.log("evnt", ele.id);
}
// End Drag Section

// Start Tasks Section
addTask = (id, value = "New Task", custom = false) => {
    div = Helper.cele('div', options['inputBox'], id)
    div.draggable = true
    input = Helper.cele('input')
    input.type = "text"
    input.value = value
    input.readOnly = true
    actions = Helper.cele('div', options['actionBox'])
    edt = Helper.cele('span', options['edtIcon'])
    trsh = Helper.cele('span', options['trshIcon'])
    Helper.addEvent(edt, 'click', edit_click)
    Helper.addEvent(trsh, 'click', trsh_click)
    Helper.addEvent(input, "focusout", inputFocusOut)
    childs = [input]
    if (custom) {
        input.hidden = true;
        div.className = options['custom_input']
    } else {
        childs.push(Helper.pushChildren(actions, [edt, trsh]))
        Storage.saveToStorage(id, value);
    }
    childs.push(Helper.cele('div', options['seprator'], `sep-${id}`))
    Helper.pushChildren(div, childs)
    Helper.gid(ids[id.split('-')[0]]).appendChild(div)
    Helper.log("add", div.id)
    addDragEvent(div)
    return div;
}
removeTask = (id) => {
    Helper.gid(id).remove()
    Storage.removeStorage(id)
}
// End Tasks Section

// On Document Ready
// main run first

// Set Page Data
document.title = options["title"]; // title
Helper.gid("title").innerHTML = options["title"]; // header title
Helper.gid("me").innerHTML = options["me"]; // developer message
// add box lists - compeleted,not started,etc... -
Helper.iter(lists, (id, value) => {
    let htmlID = ids[id];
    let child = Helper.cele(
        "div",
        options["headBox"],
        htmlID.replace("-list", "")
    );
    Helper.pushChildren(child, [
        // h1 header - Not Started,etc... -
        Helper.cele("h1", "bh1", "", value),
        // div that have element boxes
        Helper.cele("div", options["listBox"], htmlID),
        // add button that add new elements
        Helper.cele("button", "", id, "+ Add"),
    ]);
    // append all to the main body
    Helper.gid(options["main"]).appendChild(child);
    addTask(`${id}-${Helper.getUniqID()}`, "", true);
});
// iterate click event to add all buttons
Helper.iter(ids, (key, value) =>
    Helper.addEvent(
        key,
        "click",
        () => addTask(`${key}-${Helper.getUniqID()}`),
        true
    )
);


// update values from localStorage
Helper.iter(
    Storage.getAllStorage(),
    (key, value) => {
        // try {
        // add new Input Box
        addTask(key, value);
        // } catch (e) {
        //     // if error happen remove that input box
        //     Storage.removeStorage(key);
        // }
    }
);

