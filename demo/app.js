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
    $('button[name=valid]').click(function() {
        validator.valid()
    })
    $('button[name=set]').click(function() {
        validator.setTips('test1', 'Hello, I am tips!')
    })
    $('button[name=isValid]').click(function() {
        alert(validator.isValid())
    })
}()

