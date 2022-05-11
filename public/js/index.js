async function renderIndex() {


    const CHATMSG = 'chat_msg'
    const PRODMSG = 'prod_msg'

  
    Handlebars.registerPartial('header', await (await fetch('static/views/partials/header.hbs')).text());
    Handlebars.registerPartial('prodForm', await (await fetch('static/views/partials/prodForm.hbs')).text());
    Handlebars.registerPartial('prodList', await (await fetch('static/views/partials/prodList.hbs')).text());
    Handlebars.registerPartial('tableRaw', await (await fetch('static/views/partials/tableRaw.hbs')).text());
    Handlebars.registerPartial('chat', await (await fetch('static/views/partials/chat.hbs')).text());
    Handlebars.registerPartial('chatMsg', await (await fetch('static/views/partials/chatMsg.hbs')).text());
    Handlebars.registerPartial('footer', await (await fetch('static/views/partials/footer.hbs')).text());

  
    const template = Handlebars.compile(await (await fetch('static/views/main.hbs')).text());

   
    const socket = io();

    socket.on('connect', () => {
        document.querySelector('span').innerHTML = template()

        const prodForm = document.querySelector('#prodForm')

        prodForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let body = new FormData(prodForm)
            const prod = {
                title: body.get('productTitle'),
                price: parseFloat(body.get('productPrice')), 
                thumbnail: body.get('productImgUrl')
            }
            socket.emit(PRODMSG, prod);
            prodForm.reset()
        });

        const chatForm = document.querySelector('#chatForm')
        const inputMsj = document.querySelector('#chatMsj')
        const inputEmail = document.querySelector('#chatEmail')

        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
          
            const mensaje = {
                email: inputEmail.value,
                msj: inputMsj.value
            }
            socket.emit(CHATMSG, mensaje);
            inputMsj.value = null
        });

        let contadorP = 0
        const tbody = document.querySelector('#tablaProd tbody')

        socket.on(PRODMSG, (data) => {

            if (contadorP == 0) { 
                document.querySelector('#tablaProd').style.display = null
                document.querySelector('#noProd').style.display = 'none'
            }
            const item = document.createElement('tr');
            tbody.appendChild(item);
            item.outerHTML = Handlebars.compile('{{> tableRaw}}')({ producto: data })

            contadorP++
        });
        const chatList = document.querySelector('#chatList')

        socket.on(CHATMSG, (data) => {

            const msg = {
                email: data.email,
                timeStamp: (new Date(data.timeStamp)).toLocaleString(),
                msj: data.msj
            }
            const item = document.createElement('li');
            chatList.appendChild(item);
            item.outerHTML = Handlebars.compile('{{> chatMsg}}')({ msg: msg })

            chatList.parentElement.scroll(0, chatList.parentElement.scrollHeight)
        });
    })
    socket.on('disconnect', () => {
   
        document.querySelector('#serverAlert').style.display = null
    })
}
renderIndex() 