console.log('Hi GitHub, I\'m hunting you!')
var uri = new URI(location.href),
    githunt_token = uri.search(true).githunt_token,
    access_token = uri.search(true).access_token;
var repo_username = uri.segment(0),
    repo_name = uri.segment(1);

var login = null;
chrome.storage.local.get(['gh_login', 'gh_access_token'], function(result) {
    var login = result.gh_login;
    console.log(result.gh_access_token)
    if (result.gh_access_token) {
        gh_access_token = result.gh_access_token
    }
    if (access_token) {
        gh_access_token = access_token;
    }
    if (githunt_token) {
        chrome.storage.local.set({
            gh_login: githunt_token,
        });
    }
    if (access_token) {
        chrome.storage.local.set({
            gh_access_token: access_token
        });
    }
});


var phNode = '<a href="javascript:;" id="ph-trigger" class="js-selected-navigation-item pagehead-nav-item">\
  <span class="octicon octicon-gift"></span> Product Hunt</a>';

var hnNode = '<a href="javascript:;" id="hn-trigger" class="js-selected-navigation-item pagehead-nav-item">\
  <span class="octicon octicon-terminal"></span> Hacker News</a>';

var ghNode = '<a href="javascript:;" id="githunt-trigger" class="js-selected-navigation-item pagehead-nav-item">\
  <span class="octicon octicon-telescope"></span> Git Hunt</a>',
    loading = '<div class="githunt-loading"><img src="/images/spinners/octocat-spinner-16px-EAF2F5.gif"></div>',
    more = '<div class="pagination ajax_paginate" id="gh-more"><a href="javascript:;" class="js-events-pagination">More</a></div>';

$('.pagehead-nav').prepend(hnNode + phNode + ghNode);
var gh_page = 1,
    hn_page = 1,
    ph_page = 1;

$(function() {
    if (repo_username && repo_name)
        $.get('https://api.github.com/repos/' + repo_username + '/' + repo_name + '?access_token=' + gh_access_token, function(data) {
            window.description = data.description;
            window.created_at = data.created_at;
            window.updated_at = data.updated_at;
            window.stars = data.stargazers_count;
            window.homepage = data.homepage;
            window.lang = data.language;

        })

    $('body')
        .on('click', '.pagehead-nav a', function() {
            $(this).addClass('selected');
            $('.pagehead-nav a').not(this).removeClass('selected');
        })
        .on('click', '#githunt-trigger', function() {
            gh_page = 1;
            $('.two-thirds').html(loading);
            getHunts('latest', 'all', gh_page, 30);
        })
        .on('click', '#hn-trigger', function() {
            $('.two-thirds').html(loading);


            getHN('https://node-hnapi.herokuapp.com/news');



        })
        .on('click', '#hn-more', function() {
            getHN('https://node-hnapi.herokuapp.com/news2');
        })
        .on('click', '#ph-trigger', function() {
            $('.two-thirds').html(loading);
            getPH('https://api.producthunt.com/v1/posts?access_token=1c754f4476a17129f2b6aad8ab43595113f4af39571ff2a910cf40847b46d792&days_ago=' + (ph_page - 1));
        })
        .on('click', '.js-toggler-target', function() {
            if ($(this).attr('aria-label') == 'Star this repository') {
                upvote();
            }
        })

    $('body')
        .on('click', '#gh-more', function() {
            gh_page++;
            $(this).addClass('loading');
            getHunts('latest', 'all', gh_page, 30);
        })
        .on('click', '#ph-more', function() {
            ph_page++;
            $(this).addClass('loading');
            getPH('https://api.producthunt.com/v1/posts?access_token=1c754f4476a17129f2b6aad8ab43595113f4af39571ff2a910cf40847b46d792&days_ago=' + (ph_page - 1));
        })
})

function getPH(url) {
    var products = '';
    $('#ph-more').addClass('loading');
    $.getJSON(url, function(result) {
        result = result.posts
        for (var index in result) {
            var data = result[index];
            console.log(data.day)
            var product = '<div class="alert watch_started simple"><div class="body">\
                  <div class="simple">\
                    <span class="octicon octicon-star"></span>\
                    <div class="title">\
                      <a href="' + data.redirect_url + '">' + data.name + '</a></div>\
                  </div>\
                  </div><div class="hn-meta">' + data.votes_count + ' votes shared by ' + data.user.name + ' | <a href="' + data.discussion_url + '">' + data.comments_count + ' comments</a></div><div class="gh-des">' + data.tagline + '</div></div>';
            products += product;

        }
        var more = '<div class="pagination ajax_paginate" id="ph-more"><a href="javascript:;" class="js-events-pagination"><b id="ph-page-count">' + ph_page + ' day</b> ago</a></div>';
        if (ph_page == 1) {
            $('.two-thirds').html(products + '<div class="ph-future"></div>' + more);
        } else {
            $('#ph-more').removeClass('loading');
            $('.ph-future').append(products);
            $('#ph-page-count').html(ph_page + ' days');
        }

    })
}

function getHN(url) {
    var stories = '';
    $('#hn-more').addClass('loading');
    var plus = 0;
    if (url == "https://node-hnapi.herokuapp.com/news2")
        plus = 30;
    $.getJSON(url, function(result) {

        for (var index in result) {
            var data = result[index]

            var story = '<div class="alert watch_started simple"><div class="body">\
                  <div class="simple">\
                    <span class="hn-rank">' + (parseInt(index) + 1 + plus) + '.</span>\
                    <div class="title">\
                      <a href="' + data.url + '">' + data.title + '</a> <span class="story-host">(' + data.domain + ')</span></div>\
                  </div>\
                  </div><div class="hn-meta">' + data.points + ' points by ' + data.user + ' ' + data.time_ago + ' | <a href="https://news.ycombinator.com/item?id=' + data.id + '">' + data.comments_count + ' comments</a></div></div>';
            stories += story;

        }
        var more = '<div class="pagination ajax_paginate" id="hn-more"><a href="javascript:;" class="js-events-pagination">More</a></div>';
        if (url == 'https://node-hnapi.herokuapp.com/news')
            $('.two-thirds').html(stories + more);
        else {
            $('#hn-more').hide();
            $('.two-thirds').append(stories)
        }
    })

}



function getHunts(type, language, page, limit) {
    var ghUrl = 'https://githunt.io/api/' + type + '/' + language + '?p=' + page + '&limit=' + limit;
    var hunts = '';
    $.getJSON(ghUrl, function(data) {
        for (var index in data) {
            var hunt = data[index];
            hunts += '<div class="alert watch_started simple"><div class="body">\
                <div class="simple">\
                  <span class="octicon octicon-star"></span>\
                  <div class="title">\
                    <a href="https://github.com/' + hunt.username + '" data-ga-click="News feed, event click, Event click type:WatchEvent target:actor">\
                    ' + hunt.username + '</a> <span>shared</span> <a href="https://github.com/' + hunt.repo_username + '/' + hunt.repo_name + '" \
                    >' + hunt.repo_username + '/' + hunt.repo_name + '</a>\
                  </div>\
                  <div class="time">\
                    <time class="timeago" datetime="' + hunt.addtime + '" title="' + ISO(hunt.addtime) + '"></time>\
                  </div>\
                </div>\
                </div><div class="gh-des">' + hunt.description + '</div></div>';
        }
        if (page == 1) {
            hunts += '<div class="gh-future"></div>' + more;
            $('.two-thirds').html(hunts);
        } else {
            $('.gh-future').append(hunts);
            $('#gh-more').removeClass('loading');
        };
        itsTIME();

    })

}

function ISO(unix) {
    var iso = new Date(unix * 1000).toISOString();
    return iso;
}

function itsTIME() {
    $('.timeago').each(function() {
        var format = moment($(this).attr('datetime'), 'X').format("dddd MMMM Do");
        var timeago = moment($(this).attr('datetime'), 'X').fromNow();
        $(this).attr('title', format);
        $(this).text(timeago);
    })
}



function upvote() {
    chrome.storage.local.get('gh_login', function(result) {
        var token = result.gh_login;
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: 'https://githunt.io/repo/add?token=' + token,
            data: 'username=' + repo_username + '&reponame=' + repo_name + '&description=' + description + '&lang=' + lang + '&created_at=' + created_at + '&updated_at=' + updated_at + '&stars=' + stars + '&homepage=' + homepage,
            success: function(data) {
                $.post('https://githunt.io/api/upvote?token=' + token, {
                    repo_username: repo_username,
                    repo_name: repo_name
                }, function(data) {
                    if (data.status == 'good') {
                        console.log('upvoted!' + data.detail);
                    } else if (data.status == '404') {
                        window.open('https://githunt.io/submit?repo=' + location.href);
                    }
                })
            }
        })

    })

}