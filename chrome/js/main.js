console.log('Hi GitHub, I\'m hunting you!')

var phNode = '<a href="javascript:;" id="ph-trigger" class="js-selected-navigation-item pagehead-nav-item"><span class="octicon octicon-gift"></span> Product Hunt</a>';

var hnNode = '<a href="javascript:;" id="hn-trigger" class="js-selected-navigation-item pagehead-nav-item"><span class="octicon octicon-terminal"></span> Hacker News</a>';

var loading = '<div class="githunt-loading"><img src="/images/spinners/octocat-spinner-16px-EAF2F5.gif"></div>'

var ph_page = 1,
    hn_page = 1

var ph_key = '1c754f4476a17129f2b6aad8ab43595113f4af39571ff2a910cf40847b46d792'

$('.pagehead-nav').prepend(hnNode + phNode);

$(function() {

    $('body')
        .on('click', '.pagehead-nav a', function() {
            $(this).addClass('selected');
            $('.pagehead-nav a').not(this).removeClass('selected');
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
            getPH('https://api.producthunt.com/v1/posts?access_token=' + ph_key + '&days_ago=' + (ph_page - 1));
        })
        .on('click', '#ph-more', function() {
            ph_page++;
            $(this).addClass('loading');
            getPH('https://api.producthunt.com/v1/posts?access_token=' + ph_key + '&days_ago=' + (ph_page - 1));
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
            var product = '<div class="alert watch_started simple"><div class="body">' +
                '<div class="simple">' +
                '<span class="octicon octicon-star"></span>' +
                '<div class="title">' +
                '<a href="' + data.redirect_url + '">' + data.name + '</a></div>' +
                '</div></div><div class="hn-meta">' + data.votes_count + ' votes shared by ' + data.user.name + ' | <a href="' + data.discussion_url + '">' + data.comments_count + ' comments</a></div><div class="gh-des">' + data.tagline + '</div></div>';
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

            var story = '<div class="alert watch_started simple"><div class="body">' +
                '<div class="simple">' +
                '<span class="hn-rank">' + (parseInt(index) + 1 + plus) + '.</span>' +
                '<div class="title">' +
                '<a href="' + data.url + '">' + data.title + '</a> <span class="story-host">(' + data.domain + ')</span></div>' +
                '</div></div><div class="hn-meta">' + data.points + ' points by ' + data.user + ' ' + data.time_ago + ' | <a href="https://news.ycombinator.com/item?id=' + data.id + '">' + data.comments_count + ' comments</a></div></div>';
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