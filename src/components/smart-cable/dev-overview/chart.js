import * as eCharts from "echarts";

//配网线路总条数,混合线路条数,电缆线路条数,架空线路条数
const chart_line = ref(null)
const option_line = ref({
    tooltip: {
        trigger: 'item'
    },
    legend: {
        top: '3%',
        left: 'center'
    },
    color: ['#f53c8d', '#f8b729', '#22b3ff'],
    series: [
        {
            name: '配网线路',
            type: 'pie',
            radius: ['50%', '80%'],
            center: ['50%', '55%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
            },
            label: {
                show: true,
                fontSize: '1rem',
                fontWeight: 'bolder',
                position: 'inside',
                formatter: '{b}\n{c}\n{d}%'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 40,
                    position: 'inside',
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: [
                { value: 0, name: '混合线路' },
                { value: 0, name: '电缆线路' },
                { value: 0, name: '架空线路' }
            ]
        }
    ]
})


//电缆总长度,电缆段条数,电缆中间接头数量,终端头数量
const chart_cable = ref(null)
const option_cable = ref({
    tooltip: {
        trigger: 'item'
    },
    legend: {
        top: '3%'
    },
    series: [
        {
            name: '电缆',
            type: 'pie',
            center: ['50%', '55%'],
            radius: '60%',
            itemStyle: {
                borderRadius: 5
            },
            label: {
                show: true,
                fontSize: '1rem',
                fontWeight: 'bolder',
                position: 'inside',
                formatter: '{b}\n{c}\n{d}%'
            },
            data: [
                { value: 0, name: '电缆段' },
                { value: 0, name: '电缆中间接头' },
                { value: 0, name: '终端头' },
            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
})
const initChart_cable = () => {
    var chartDom = document.querySelector(".statisticPieChart_cable")
    chart_cable.value = eCharts.init(chartDom);
    chart_cable.value.setOption(option_cable.value, true);
}
//电缆通道条数，长度,排管长度,隧道长度,管廊长度,电缆井数量
const chart_channel = ref(null)
const option_channel = ref({
    tooltip: {
        trigger: 'item'
    },
    legend: {
        top: '3%'
    },
    series: [
        {
            name: '电缆',
            type: 'pie',
            center: ['50%', '55%'],
            radius: ['30%', '70%'],
            itemStyle: {
                borderRadius: 5
            },
            label: {
                show: true,
                fontSize: '1rem',
                fontWeight: 'bolder',
                position: 'inside',
                formatter: '{b}\n{c}KM\n{d}%'
            },
            data: [
                { value: 0, name: '排管' },
                { value: 0, name: '隧道' },
                { value: 0, name: '管廊' },
            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
})
const initChart_channel = () => {
    var chartDom = document.querySelector(".statisticPieChart_channel")
    chart_channel.value = eCharts.init(chartDom);
    chart_channel.value.setOption(option_channel.value, true);
}

export {
    chart_line,
    option_line,
    chart_cable,
    option_cable,
    chart_channel,
    option_channel,
    initChart_cable,
    initChart_channel
}