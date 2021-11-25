export function Form({datum, rel_datum, data_stash, rel_type, card_edit, postSubmit, card_display}) {
  const modal_el = document.querySelector('#form_modal'),
    modal = M.Modal.getInstance(modal_el);
  console.log(card_edit)

  setupFromHtml();
  modal.open();

  function setupFromHtml() {
    console.log(card_edit)
    modal_el.innerHTML = (`
      <div class="modal-content">
        <form>
          <div>
            <div style="text-align: left">
              <span style="display: ${datum.to_add || !!rel_datum ? 'none' : null}; float: right; cursor: pointer" class="red-text delete">delete</span>
            </div>
            <div>
              <label><input type="radio" name="gender" value="M" ${datum.data.gender === 'M' ? 'checked' : ''}><span>male</span></label><br>
              <label><input type="radio" name="gender" value="F" ${datum.data.gender === 'F' ? 'checked' : ''}><span>female</span></label><br>
            </div>
          </div>
          ${getEditFields(card_edit)}
          ${(rel_type === "son" || rel_type === "daughter") ? otherParentSelect() : ''}
          <br><br>
          <div style="text-align: center">
            <button type="submit" class="btn">submit</button>
          </div>
        </form>
      </div>
    `)
    modal_el.querySelector("form").addEventListener('submit', submitFormChanges)
    modal_el.querySelector(".delete").addEventListener('click', deletePerson)
    M.FormSelect.init(modal_el.querySelectorAll("select"));
  }

  function otherParentSelect() {
    return (`
      <div class="input-field">
        <select name="other_parent">
          ${(!rel_datum.rels.spouses || rel_datum.rels.spouses.length === 0) 
              ? '' 
              : rel_datum.rels.spouses.map((sp_id, i) => {
                  const spouse = data_stash.find(d => d.id === sp_id)
                  return (`<option value="${sp_id}" ${i === 0 ? 'selected' : ''}>${card_display[0](spouse)}</option>`)
                }).join("\n")}
          <option value="${'_new'}">NEW</option>
        </select>
        <label>Select other parent</label>
      </div>
    `)
  }

  function submitFormChanges(e) {
    e.preventDefault()
    const form_data = new FormData(e.target)
    form_data.forEach((v, k) => datum.data[k] = v)

    modal.close()
    postSubmit()
  }

  function deletePerson() {
    modal.close()
    postSubmit({delete: true})
  }

  function getEditFields(card_edit) {
    return card_edit.map(d => (
      d.type === 'text'
        ? `<input type="text" name="${d.key}" placeholder="${d.placeholder}" value="${datum.data[d.key] || ''}">`
        : d.type === 'textarea'
        ? `<textarea class="materialize-textarea" name="${d.key}" placeholder="${d.placeholder}">${datum.data[d.key] || ''}</textarea>`
        : ''
    )).join('\n')
  }
}