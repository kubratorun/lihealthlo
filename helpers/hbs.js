const moment = require('moment')

module.exports = {
    generateDate: (date,format) =>{
        return moment(date).format(format)
    },


    //1. fonksiyon oluşturduk limit: fonksiyonumuz 
    //2. fonksiyon 2 parametre alıcak
    //3. eğer array değilse (arr) kontrol ediyoruz
    //4 eğer if statement doğruysa return[]
    //
    
    limit: (arr,limit)=>{
        if(!Array.isArray(arr)) {return []}

        return arr.slice(0,limit)
    },

   
    truncate: (str,len)=>{
        if(str.length > len) str = str.substring(0,len) + '...'
        return str
    },
    paginate: (options)=>{
        let outputHTML = ''
    if(options.hash.current === 1){
        outputHTML +=` <li class="page-item disabled"><a class="page-link" href="#">First</a></li>`
    } else{
        outputHTML +=` <li class="page-item "><a class="page-link" href="?page=1">First </a></li>`
    }   

    let i = (Number(options.hash.current) > 5 ? Number(options.hash.current) - 3 : 1 )

    if (i !== 1) {
        outputHTML +=` <li class="page-item disabled"><a class="page-link">...</a></li>`
    }
    for (; i <= (Number(options.hash.current) + 3) && i <= options.hash.pages; i++) { 
         if (i === options.hash.current) { 
            outputHTML +=` <li class="page-item active"><a class="page-link">${i}</a></li>`
         }else{
            outputHTML +=` <li class="page-item"><a class="page-link" href="?page=${i}">${i}</a></li>`
         }

         if(i == Number(options.hash.current) + 3 && i < options.hash.pages) {
            outputHTML +=` <li class="page-item disabled"><a class="page-link">...</a></li>`

         }

        } 

        if (options.hash.current == options.hash.pages){
            outputHTML +=` <li class="page-item disabled"><a class="page-link">Last</a></li>`

        }else{
            outputHTML +=` <li class="page-item"><a class="page-link" href="?page=${options.hash.pages}">Last</a></li>`

        }
        return outputHTML

    }
}
  