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
            labels: ['số ca bình phục', 'Số ca tử vong', 'số ca nhiễm hiện tại'],
            datasets: [{
                label: 'My First dataset',
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

let drowChars2=(lab,datas)=>{
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
                label: 'My First dataset',
                backgroundColor: ['rgb(0,123,255)'],
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
let getDataByDate=(country,datefrom,dateto)=>{
    getByDate(country,datefrom,dateto).then(lists=>{
        let lab=[];
        let datas=[];
        lists.forEach(e=>{
            lab.push(e.Date)
            datas.push(e.Confirmed)
        });
        console.log(lab+" "+datas)
        drowChars2(lab,datas)
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
                let date1=new Date();
                getDataByDate(element.Country,date1.setDate(date1.getDate()-7),date1);
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