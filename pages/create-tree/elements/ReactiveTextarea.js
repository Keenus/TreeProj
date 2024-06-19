import f3 from "../../../src/index.js"

export default function ReactiveTextarea(updateData, textarea_selector, update_btn_selector) {
  const textarea = document.querySelector(textarea_selector)

  document.querySelector(update_btn_selector).addEventListener("click",  () => {
    if(!textarea.value) {
      alert('Brak danych do zapisania');
      return;
    }
    const data = JSON.stringify(JSON.parse(textarea.value), null, 2);
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tree.json';
    a.click();
  })

  return {update: updateTextArea}

  function updateTextArea(data) {
    let data_no_to_add = JSON.parse(JSON.stringify(data))
    data_no_to_add.forEach(d => d.to_add ? f3.handlers.removeToAdd(d, data_no_to_add) : d)
    data_no_to_add.forEach(d => delete d.main)
    data_no_to_add.forEach(d => delete d.hide_rels)
    textarea.value = JSON.stringify(data_no_to_add, null, 2)
  }
}