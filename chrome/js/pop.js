console.log('Hi GitHub, I\'m hunting you!')


function login () {
  console.log('login to githunt!');
  window.open('https://githunt.io/user/signin/github?from=extension');
}

check();

function check () {
  chrome.storage.local.get('gh_login', function (result) {
        var token = result.gh_login;
        $('.loading').hide();
          if (token)
            $('#logged').show();
          else
            $('#signin').show();
    });

}

$(document).ready(function() {

  $('#signin').click(function () {
    login();
  })

})