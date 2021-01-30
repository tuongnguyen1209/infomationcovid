import {getCountry,getSummary,getByDate} from './service.js'

let chart1 =null;
let chart2 =null;


let loadCountry=()=>{
    let countryData=document.getElementById("country");
    countryData.innerHTML="";
    getCountry().then((countries)=>{
        countries.forEach(c => {
            let p=` <option value="${c.Country}" >`;
            countryData.innerHTML+=p;
        });
        
    })
}

let drowChars1=(tongso,datas)=>{
    let ctx = document.getElementById('myChart1').getContext('2d');
    if(chart1!=null){
        chart1.destroy();
    }
        chart1= new Chart(ctx, {
        // The type of chart we want to create
        type: 'pie',

        // The data for our dataset
        data: {
            labels: ['Số Ca hồi phục', 'Số Ca Tử Vong', 'Số Ca Nhiễm Hiện Tại'],
            datasets: [{
                label: '',
                backgroundColor: ['rgb(40, 167, 69)','rgb(220,53,69)','rgb(0,123,255)'],
                borderColor: 'rgb(255, 255, 255)',
                data: datas
            }]
        },

        // Configuration options go here
        options: {
            title: {
                display: true,
                text: `Biểu Đồ Thể Hiện Tình Hình Dịch Bệnh Của ${$("#txtcountry").val()} (Tổng số ca mắc: ${tongso} ca)`
            }
        }
    });
    
}

let drowChars2=(lab,datasMac,dataTu,dataHPhuc)=>{
    let ctx = document.getElementById('myChart2').getContext('2d');
    if(chart2!=null){
        chart2.destroy();
    }
        chart2= new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: lab,
            datasets: [{
                label: 'Tổng Số Ca Mắc',
                borderColor:'rgb(255, 193, 7)',
                backgroundColor:'#FFF',
                data: datasMac,
                fill: false,
                borderWidth: 1
                },{
                    label: 'Tổng Số Ca Tử Vong',
                    borderColor:'rgb(220,53,69)',
                    backgroundColor:'#FFF',
                    data: dataTu,
                    fill: false,
                    borderWidth: 1,
                },{
                    label: 'Tổng Số Ca Hồi Phục',
                    borderColor:'rgb(40, 167, 69)',
                    backgroundColor:'#FFF',
                    data: dataHPhuc,
                    fill: false,
                    borderWidth: 1,
                }
            ]
        },

        // Configuration options go here
        options: {
            title: {
                
                display: true,
                text: `Biểu Đồ Thể Hiện Tình Hình Dịch Bệnh Trong 1 Tháng`
            }
        }
    });
    
}
let getDataByDate=(country,datefrom)=>{
    getByDate(country,datefrom).then(lists=>{
        let lab=[];
        let datasTong=[];
        let datasTu=[];
        let datasHPhuc=[];
        lists.forEach(e=>{
            lab.push(e.Date)
            datasTong.push(e.Confirmed)
            datasTu.push(e.Deaths)
            datasHPhuc.push(e.Recovered)
        });
        
        drowChars2(lab,datasTong,datasTu,datasHPhuc)
    }).catch(err=>{console.log(err)})
}
let loadDataToTable= ()=>{
    let kw=document.getElementById("txtcountry").value;
    let tBody=document.getElementById("bodytable");
    tBody.innerHTML="";
    getSummary().then((lis)=>{
        
        lis['Countries'].forEach(element => {
            if(element.Country==kw){
                let now=element.TotalConfirmed-element.TotalRecovered-element.TotalDeaths;
                let p=`<tr>
                        <td >${element.Country}</td>
                        <td class="text-warning"><strong>${element.TotalConfirmed}</strong></td>
                        <td class="text-success"><strong>${element.TotalRecovered}</strong></td>
                        <td class="text-primary"><strong>${now}</strong></td>
                        <td class="text-danger"><strong>${element.TotalDeaths}</strong></td>
                    </tr>`;
                tBody.innerHTML+=p;
                drowChars1(element.TotalConfirmed,[element.TotalRecovered,element.TotalDeaths,now]);
                
                let date2=new Date();
                date2.setDate(date2.getDate()-30)
                getDataByDate(element.Country,date2.toISOString());
            }
        });
    })

}



window.onload=()=>{

    $("#tableThongke").hide()
    
    loadCountry();

    document.getElementById("txtcountry").addEventListener("change",()=>{
        loadDataToTable();
        $("#tableThongke").show(1000)
    })
}