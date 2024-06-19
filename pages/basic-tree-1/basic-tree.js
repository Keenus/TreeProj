import f3 from '../../src/index.js'

let data = [];

document.getElementById('fileInput').addEventListener('click', function() {
    document.getElementById('file').click();
    console.log('click')
})

document.getElementById('file').addEventListener('change', function() {
    console.log('change')
    const reader = new FileReader();
    reader.onload = function() {
        console.log('1')
        data = JSON.parse(reader.result);
        document.getElementById('fileInput').value = '';
        if (data && data.length > 0) {
            console.log('data', data)
            console.log('data', data)
            const store = f3.createStore({
                    data,
                    node_separation: 250,
                    level_separation: 150
                }),
                view = f3.d3AnimationView({
                    store,
                    cont: document.querySelector("#FamilyChart")
                }),
                Card = f3.elements.Card({
                    store,
                    svg: view.svg,
                    card_dim: {w: 220, h: 70, text_x: 75, text_y: 15, img_w: 60, img_h: 60, img_x: 5, img_y: 5},
                    card_display: [d => d.data.label || '', d => d.data.desc || ''],
                    mini_tree: true,
                    link_break: false
                })

            view.setCard(Card)
            store.setOnUpdate(props => view.update(props || {}))
            store.update.tree({initial: true})

            document.getElementById('EmptyDataInfo').style.display = 'none';

        }
    }
    reader.readAsText(this.files[0]);

});
