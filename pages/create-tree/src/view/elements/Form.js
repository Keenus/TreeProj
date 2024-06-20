export function Form({datum, rel_datum, store, rel_type, card_edit, postSubmit, card_display, edit: {el, open, close}}) {
  setupFromHtml();
  open();

  function setupFromHtml() {
    el.innerHTML = (`
        <div class="modal-content">
            <form>
                <div class="form-header">
                    <span class="delete" style="display: ${datum.to_add || !!rel_datum ? 'none' : 'inline-block'}">Usuń</span>
                </div>
                <div class="container-fluid">
                    <div class="row mob">
                        <span class="form-label">Płeć: </span>
                        <label class="male-radio">
                            <input type="radio" name="gender" value="M" ${datum.data.gender === 'M' ? 'checked' : ''}>
                            <span>Mężczyzna</span>
                        </label>
                        <label class="female-radio">
                            <input type="radio" name="gender" value="F" ${datum.data.gender === 'F' ? 'checked' : ''}>
                            <span>Kobieta</span>
                        </label>
                    </div>
                </div>
                ${getEditFields(card_edit)}
                ${(rel_type === "son" || rel_type === "daughter") ? otherParentSelect() : ''}
                <div class="modal-footer">
                    <button type="submit" class="btn">Potwierdź</button>
                </div>
            </form>
        </div>
    `);
    el.querySelector("form").addEventListener('submit', submitFormChanges);
    el.querySelector(".delete").addEventListener('click', deletePerson);
  }

  function otherParentSelect() {
    const data_stash = store.getData();
    return (`
      <div>
        <label>Wybierz drugiego rodzica</label>
        <select name="other_parent" style="display: block">
          ${(!rel_datum.rels.spouses || rel_datum.rels.spouses.length === 0) 
              ? '' 
              : rel_datum.rels.spouses.map((sp_id, i) => {
                  const spouse = data_stash.find(d => d.id === sp_id)
                  return (`<option value="${sp_id}" ${i === 0 ? 'selected' : ''}>${card_display[0](spouse)}</option>`)
                }).join("\n")}
          <option value="${'_new'}">Dodaj nowego partnera (ojca/matkę dziecka)</option>
        </select>
      </div>
    `)
  }

  function submitFormChanges(e) {
    e.preventDefault()
    const form_data = new FormData(e.target)
    form_data.forEach((v, k) => datum.data[k] = v)

    close()
    postSubmit()
  }

  function deletePerson() {
    close()
    postSubmit({delete: true})
  }

  function getEditFields(card_edit) {
    return card_edit.map(d => (
      d.type === 'text'
        ? `<label for="${d.key}">${d.placeholder}</label> <input type="text" id="${d.key}" name="${d.key}" placeholder="${d.placeholder}" value="${datum.data[d.key] || ''}">`
        : d.type === 'textarea'
        ? `<textarea class="materialize-textarea" name="${d.key}" placeholder="${d.placeholder}">${datum.data[d.key] || ''}</textarea>`
        : ''
    )).join('\n')
  }
}