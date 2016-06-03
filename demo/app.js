!function (){
    var validator = new Validator($('form'), {
        config: {
            'test1': {
                required: true,
                valid: /\w{3,}/,
                validTips: '最少输入3个字符'
            },
            'test2': {
                required: true
            }
        },
        handle: function(error, $el) {
            if(error) {
                $el.next().html(error.tips)
            } else {
                $el.next().html('')
            }
        }
    })
    $('button').click(function() {
        validator.valid()
    })
}()

