
/* global $ */
var params = {
    data: {
        FirstFilter: ['item1', 'item2'],
        SecondFilter: ['item1']
    },
    multiSelect: true,
    allText: 'All'
}
function createItem(item){
    return $('<div></div>').append($('<a></a>').text(item));
}
var MultiFilter = function(jqueryDom, params) {
    this.params = params;
    this.dom = jqueryDom;
    this.fields = [];
    jqueryDom.empty();
    for(var field in params.data){
        var fieldDom = $('<dl></dl>');
        this.fields.push({
            id: field,
            dom: fieldDom
        });
        jqueryDom.append(fieldDom);
        fieldDom.append($('<dt></dt>').text(field + ': '));
        fieldDom.append($('<dd></dd>').append(createItem(params.allText)))
        params.data[field].forEach(function(item){
            fieldDom.append($('<dd></dd>').append(createItem(item)));
        });
    }
    this.initialEvents();
};

MultiFilter.prototype = {
    initialEvents: function(){
        var me = this;
        this.fields.forEach(function(field){
            field.dom.find('a').first().addClass('seled');
        });
        this.dom.find('a').hover(
            function(){
                $(this).addClass('seling');
            },
            function(){
                $(this).removeClass('seling');
            }
        );
        this.dom.find('a').click(function(event){
            $(this).parents('dl').find('a').removeClass('seled');
            $(this).addClass('seled');
            me.onSelectChange();
        });
    },
    onSelectChange: function(){
        if(!this.onChange) return;
        var selected = [];
        this.fields.forEach(function(item){
            var result = [];
            item.dom.find('a.seled').each(function(){
                result.push($(this).text());
            });
            selected.push({
                id: item.id,
                field: result,
            })
        });
        this.onChange(selected);
    }
}