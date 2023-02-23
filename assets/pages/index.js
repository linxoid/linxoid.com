function sendCorsRequest(url, opts, success, error) {
  var normalizedUrl = url.indexOf('http') === 0 ? url : ['https://api.ourai.ws', url].join('');

  return $.ajax(normalizedUrl, $.extend(true, {
    xhrFields: {
      withCredentials: true
    },
    success,
    error
  }, opts));
}

function ensureLoggedIn(handleLoggedIn, handleNotLoggedIn) {
  sendCorsRequest('/user', { type: 'get' }, handleLoggedIn, handleNotLoggedIn || function() {
    location.href = '/';
  });
}
;

ensureLoggedIn(function(user) {
  $('#userArea').text(['欢迎你，', user.email].join(''));
}, function() {
  $('#userArea').hide();
  $('#loginArea').show();

  var $iptEmail = $('#inputEmail');
  var $iptCode = $('#inputCode');
  var $btnGetCode = $('#getCode');

  $btnGetCode.on('click', function() {
    if ($iptEmail.val() === '') {
      alert('请输入邮箱');
    }
    else {
      sendCorsRequest('/auth/mail', {
        type: 'post',
        data: {
          email: $iptEmail.val()
        }
      }, function() {
        alert('验证码发送成功，请到邮箱中查看');
        $iptCode.prop('disabled', false);
      }, function(err) {
        alert(err.responseText);
      });
    }

    return false;
  });

  $('#loginForm').on('submit', function() {
    if ($iptEmail.val() === '') {
      alert('请输入邮箱');
    }
    else if ($iptCode.val() === '') {
      alert('请输入验证码');
    }
    else {
      sendCorsRequest('/auth/mail/code', {
        type: 'post',
        data: {
          email: $iptEmail.val(),
          code: $iptCode.val()
        }
      }, function() {
        location.reload();
      }, function(err) {
        alert(err.responseText)
      });
    }

    return false;
  });
});
