export default function CalculateTree({datum, data_stash, card_dim, labels}) {
  const sx = card_dim.w+40, y = card_dim.h+50,
    lbls = labels || {}
  datum = datum ? datum : {id: "0", data: {fn: "FN", ln: "LN", gender: "M"}}
  const data = [
    {x: 0, y: 0, data: datum},
    {x: -100, y: -y, data: {rel_type: 'father', data: {label: lbls.father || "Dodaj tatę", gender: "M"}}},
    {x: 100, y: -y, data: {rel_type: 'mother', data: {label: lbls.mother || "Dodaj mamę", gender: "F"}}},

    {x: sx, y: 0, data: {rel_type: 'spouse', data: {label: lbls.spouse || "Dodaj partnera", gender: "F"}}},

    {x: -100, y: y, data: {rel_type: 'son', data: {label: lbls.son || "Dodaj syna", gender: "M"}}},
    {x: 100, y: y, data: {rel_type: 'daughter', data: {label: lbls.daughter || "Dodaj córkę", gender: "F"}}},
  ].filter(d => shouldAddRel(d.data.rel_type))

  function shouldAddRel(rel_type) {
    if (rel_type === 'father') return !datum.rels.father || data_stash.find(d => d.id === datum.rels.father).to_add
    else if (rel_type === 'mother') return !datum.rels.mother || data_stash.find(d => d.id === datum.rels.mother).to_add
    else return true
  }

  return {data}
}
