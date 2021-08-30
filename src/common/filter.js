let filter = {};



filter.filterguapaishijian = value => {
  return new Date(value).Format('yyyy-MM-dd')
}

filter.scrollTextFilter = value =>{
  return {load:'加载中...',over:'亲，已经到底了哦！',unload:'下拉加载更多',hide:''}[value]
}

export default filter;