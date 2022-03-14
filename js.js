let data = {};
let isChangingId = 0;
LoadRecords();

/**Загружает и вставляет в таблицу json */
async function LoadRecords() {
    let response = await fetch('/mini_db.json',{
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    });
    data = await response.json();
    for(let i in data){
        document.getElementsByClassName('table')[0].innerHTML += GenerateRecord(i);
    }
}
/**Есть id - возвращает существующую запись как строку,
 *  нет id - создаёт и возвращает новую с данными из инпутов
 */
function GenerateRecord(id){
    let newRecord = {time1:'', time2:'', title:'', status:'',text:''}
    
    if(id){
        newRecord.time1  = data[id]['time1'];
        newRecord.time2  = data[id]['time2'];
        newRecord.title  = data[id]['title'];
        newRecord.status = data[id]['status'];
        newRecord.text   = data[id]['text'];
    }else{
        let now = new Date();
        let zeroForMonth = '';
        if(now.getMonth()+1<10){zeroForMonth = '0'}

        if(newRecord.time1  = document.getElementById('input1').value){}else{
            newRecord.time1 = now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();
        };
        if(newRecord.time2  = document.getElementById('input2').value){}else{
            newRecord.time2 = now.getDate()+'.'+zeroForMonth+(now.getMonth()+1)+'.'+now.getFullYear();
        };
        if(newRecord.title  = document.getElementById('input3').value){}else{
            newRecord.title = 'Title';
        };
        newRecord.status = document.getElementById('input4').value;
        newRecord.text   = document.getElementById('input5').value;

        //Поиск свободного id начиная с первого
        id = 1;
        while(data[id]){
            id++;
        }
        //Вставка в массив новой записи
        data[id] = newRecord;
    }
    return (`
        <tr class="title_row el`+id+` cursor" onclick="ShowTextRow(this)">
            <td class="col1"><p>`+newRecord.time1 +`</p><p>`+newRecord.time2+`</p></td>
            <td class="col2">`+newRecord.title +`</td>
            <td class="col3">`+newRecord.status+`</td>
        </tr>
        <tr class="text_row">
            <td class="el`+id+`" colspan="3">
                <div class="cursor" onclick="DeleteRecord(this)">del</div>
                <div class="cursor" onclick="EditRecord(this)">edit</div><br>
                <div>`+newRecord.text+`</div>
            </td>
        </tr>
    `);
}
/**Отправляет на сервер массив всех данных */
async function SendRecords(){
    let response = await fetch('/post',{
        method:'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
    });
}
/**Показывает сообщение */
function ShowTextRow(row) {
    let id = row.classList[1];
    let textRow = document.getElementsByClassName(id)[1];

    if(textRow.style.display == ''){
        row.style.backgroundColor='#80808080'
        textRow.style.display = 'table-cell';
        textRow.style.animation = 'showrow 0.2s 1 both normal';
    }else{
        row.style.backgroundColor='';
        textRow.style.animation = '';
        textRow.style.display = '';
    }
}
/**Открывает редактирование записи */
function EditRecord(div){
    let id = div.parentElement.classList[0];
    isChangingId = Number(id.slice(2));//Вставляет id для режима редактирования
    let rows = document.getElementsByClassName(id);//Перемещает запись в инпут
    document.getElementById('input1').value = rows[0].childNodes[1].childNodes[0].innerHTML;
    document.getElementById('input2').value = rows[0].childNodes[1].childNodes[1].innerHTML;
    document.getElementById('input3').value = rows[0].childNodes[3].innerHTML;
    document.getElementById('input4').value = rows[0].childNodes[5].innerHTML;
    document.getElementById('input5').value = rows[1].childNodes[6].innerHTML;
}
/**Отправляет из инпутов в таблицу (+режим редактирования) */
function SendText(){
    sorting = document.getElementsByClassName('sorting')[0];
    if(isChangingId){//Если в режиме редактирования - изменяет массив
        data[isChangingId]['time1']  = document.getElementById('input1').value;
        data[isChangingId]['time2']  = document.getElementById('input2').value;
        data[isChangingId]['title']  = document.getElementById('input3').value;
        data[isChangingId]['status'] = document.getElementById('input4').value;
        data[isChangingId]['text']   = document.getElementById('input5').value;
        EarseRecord('el'+isChangingId);
    }
    
    sorting.outerHTML += GenerateRecord(isChangingId);
    isChangingId = 0;

    document.getElementById('input1').value = '';
    document.getElementById('input2').value = '';
    document.getElementById('input3').value = '';
    document.getElementById('input4').value = 'in progress';
    document.getElementById('input5').value = '';
    SendRecords()
}
/**Удаляет запись везде */
function DeleteRecord(div) {
    let id = div.parentElement.classList[0];
    EarseRecord(id);
    delete data[id.slice(2)];
    SendRecords()
}
/**Стирает запись только в таблице по классу */
function EarseRecord(id) {
    document.getElementsByClassName(id)[1].parentNode.outerHTML='';
    document.getElementsByClassName(id)[0].outerHTML='';
}
/**Заменяет данные из файла */
function ReadUserFile(input) {
    if(input.value){
        let file = input.files[0];
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(){
            for(let i in data){
                EarseRecord('el'+i)
            }
            data = JSON.parse(reader.result);
            for(let i in data){
                document.getElementsByClassName('table')[0].innerHTML += GenerateRecord(i);
            }
            SendRecords();
        };
        reader.onerror = function(){
            console.log(reader.error);
        };
    }
}
/**Перекрашивает тему */
function ChangeTheme(){
    if(document.documentElement.style.getPropertyValue('--main-color') == '#000'){
        document.documentElement.style.setProperty('--main-color', '#fff');
        document.documentElement.style.setProperty('--second-color', '#ff4646');
        document.documentElement.style.setProperty('--third-color', '#000');
    }else{
        document.documentElement.style.setProperty('--main-color', '#000');
        document.documentElement.style.setProperty('--second-color', '#5afff1');
        document.documentElement.style.setProperty('--third-color', '#fff');
    }
}
/**Сортировка таблицы */
function SortingTable(sortParam){
    let arr = [];
    for(let i in data){
        EarseRecord('el'+i);
        if(sortParam=='time'){
            let time1 = data[i][sortParam+1].split(':')
            let time2 = data[i][sortParam+2].split('.')
            let time = new Date(time2[2], time2[1], time2[0], time1[2], time1[1], time1[0]);
            arr.push([(+time),i])
        }else{
            arr.push([data[i][sortParam],i])
        }
        function compareNumeric(a, b) {
            if (a[0] > b[0]) return 1;
            if (a[0] == b[0]) return 0;
            if (a[0] < b[0]) return -1;
        }
        arr.sort(compareNumeric);
    }
    for(let i=0; i<arr.length; i++){
        document.getElementsByClassName('table')[0].innerHTML += GenerateRecord(arr[i][1]);
    }
}