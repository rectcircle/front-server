/**
 * 定义一组处理登录的类
 *
 */
define('ArticleAdmin', ['Common'], function (Common) {
    function ArticleAdmin () {
        $('#publishArticle').click(addArticle); // 发布文章
        $('#saveArticle').click(addArticle); // 保存文章
        $('#listTab').click(getArticleList); // 获取文章列表
        $('#newArticle').click(newArticle); // 删除绑定的文章id，为新建文章
        $('#tagTab').click(getTagList);
        $('#subjectTab').click(getSubjectList);
        $('#updateSubject').click(saveSubject); // 更新主题
        $('#newSubject').click(saveSubject); // 更新主题
        $('#deleteArticle').click(deleteArticle);

    }

    ArticleAdmin.prototype.articleList = {};

	// 删除文章
    function deleteArticle () {

        var id = $('#editView').data('id');

        $.ajax({
            url: 'admin/article/delete',
            type: 'POST',
            dataType: 'json',
            data: {
                id: id,
            },
        })
		.done(function (data) {
    if (data.errcode === 0) {
        Common.showPromptBox('删除成功', 'success');
        getArticleList();
        $('#listTab a').tab('show');
    } else {
        Common.showPromptBox(data.errmsg);
    }
    console.log('success');
})
		.fail(function () {
    Common.showPromptBox('删除文章，请求失败');
});
    }


	// 保存主题
    function saveSubject () {

        var formData = {};

        if ($(this).data('flag') == 'update') {
            formData.id = $('#subjectIdInput').val();
        }
        formData.name = $('#subjectNameInput').val();
        formData.description = $('#subjectDescriptionInput').val();

        $.ajax({
            url: 'admin/subject/add',
            type: 'POST',
            dataType: 'json',
            data: formData,
        })
		.done(function (data) {
    if (data.errcode === 0) {
				// Common.showPromptBox("保存成功","success");
        getSubjectList();
    } else {
        Common.showPromptBox(data.errmsg);
    }
    console.log('success');
})
		.fail(function () {
    Common.showPromptBox('添加主题，请求失败');
});

    }

	// 获取主题列表
    function getSubjectList () {
        console.log('进入');
        $.ajax({
            url: 'admin/subject/getList',
            type: 'POST',
            dataType: 'json',
            data: getFormData($(this)),
        })
		.done(function (data) {
    console.log(data);
    if (data.errcode === 0) {
        createSubjectListView(data.data);
    } else {
        Common.showPromptBox(data.errmsg);
    }

})
		.fail(function () {
    Common.showPromptBox('获取主题列表，请求失败');
});

    }


	// 处理主题页面，并绑定事件
    function createSubjectListView (data) {
        var html = '';

        data.forEach(function (e) {
            html += '<tr>' +
					'	<td>' + e.id + '</td>' +
					'	<td>' + e.name + '</td>' +
					'	<td>' + e.number + '</td>' +
					'	<td>' + e.description + '</td>' +
					'	<td>' +
					'		<button data-name="' + e.name + '" type="button" class="btn btn-success subject-article" >添加到文章编辑</button>' +
					'		<button data-name="' + e.name + '" data-id="' + e.id + '" data-description="' + e.description + '" type="button" class="btn btn-warning subject-edit">编辑主题</button>' +
					'		<button data-id="' + e.id + '" type="button" class="btn btn-danger subject-del">删除</button>' +
					'	</td>' +
					'</tr>';
        });

        var $html = $(html);

        $html.find('.subject-article').click(function (event) {
            var $subject = $('#subject');

            if (!$subject.val() || $subject.val() == '') {
                $subject.val($(this).data('name') + ':0');
            } else {
                if ($subject.val().indexOf($(this).data('name')) == -1) {
                    $subject.val($subject.val() + ',' + $(this).data('name') + ':0');
                }
            }
            $('#editTab a').tab('show');

        });

        $html.find('.subject-edit').click(function (event) {
            var id = $(this).data('id');
            var name = $(this).data('name');
            var description = $(this).data('description');

            $('#subjectIdInput').val(id);
            $('#subjectNameInput').val(name);
            $('#subjectDescriptionInput').val(description);
        });

        $html.find('.subject-del').click(function (event) {
            var id = $(this).data('id');
            $.ajax({
                url: 'admin/subject/remove',
                type: 'POST',
                dataType: 'json',
                data: {
                    id: id,
                },
            })
			.done(function (data) {
    if (data.errcode === 0) {
        getSubjectList();
    } else {
        Common.showPromptBox(data.errmsg);
    }
    console.log('success');
})
			.fail(function () {
    Common.showPromptBox('删除主题，请求失败');
});
        });

        $('#subjectListView').empty().append($html);
    }

	// 获取标签列表
    function getTagList () {
        $.ajax({
            url: 'admin/tag/getList',
            type: 'POST',
            dataType: 'json',
            data: getFormData($(this)),
        })
		.done(function (data) {
    console.log(data);
    if (data.errcode === 0) {
        createTagListView(data.data);
    } else {
        Common.showPromptBox(data.errmsg);
    }

})
		.fail(function () {
    Common.showPromptBox('获取标签列表，请求失败');
});

    }

	// 处理标签页面，并绑定事件
    function createTagListView (data) {
        var html = '';

        data.forEach(function (e) {
            html += '<tr>' +
					'<td>' + e.id + '</td>' +
					'<td>' + e.name + '</td>' +
					'<td>' + e.number + '</td>' +
					'<td>' +
					'	<button type="button" data-id="' + e.id + '"  data-name="' + e.name + '" class="btn btn-success tag-article" >添加到文章编辑</button>' +
					'	<button type="button" data-id="' + e.id + '"  data-name="' + e.name + '" class="btn btn-danger tag-del" >删除</button>' +
					'</td>' +
					'</tr>';
        });

        var $html = $(html);

        $html.find('.tag-article').click(function (event) {
            var $tags = $('#tags');

            if (!$tags.val() || $tags.val() == '') {
                $tags.val($(this).data('name'));
            } else {
                if ($tags.val().indexOf($(this).data('name')) == -1) {
                    $tags.val($tags.val() + ',' + $(this).data('name'));
                }
            }

            $('#editTab a').tab('show');


        });

        $html.find('.tag-del').click(function (event) {
            var id = $(this).data('id');
            $.ajax({
                url: 'admin/tag/remove',
                type: 'POST',
                dataType: 'json',
                data: {
                    id: id,
                },
            })
			.done(function (data) {
    if (data.errcode === 0) {
        getTagList();
    } else {
        Common.showPromptBox(data.errmsg);
    }
    getTagList();
})
			.fail(function () {
    Common.showPromptBox('删除标签，请求失败');
});
        });

        $('#tagListView').empty().append($html);
    }

	// 恢复为新建文章
    function newArticle () {
        $('#editView').removeData('id');
        $('#articleStatus').text('New');

    }

	// 获取处理保存文章的表单数据
    function getFormData ($this) {
        var formData = {
            title: $('#title').val(),
            content: simplemde.value(),
            author: 'rectcircle',
            status: $this.data('status'),
        };

        var id = $('#editView').data('id');
        var tagString = $('#tags').val();
        var subjectString = $('#subject').val();

        if (id) {
            formData.id = id;
        }

        if (tagString) {
            formData.tagString = tagString;
        }

        if (subjectString) {
            formData.subjectString = subjectString;
        }

        return formData;
    }

	// 添加文章
    function addArticle () {
        $.ajax({
            url: 'admin/article/add',
            type: 'POST',
            dataType: 'json',
            data: getFormData($(this)),
        })
		.done(function (data) {
    if (data.errcode === 0) {
        Common.showPromptBox('保存或发布成功', 'success');
        $('#editView').data('id', data.data);
        getArticleList();
        $('#listTab a').tab('show');
    } else {
        Common.showPromptBox(data.errmsg);
    }
    console.log('success');
})
		.fail(function () {
    Common.showPromptBox('添加文章，请求失败');
});

    }

	// 获取文章对象，从缓存中
    function getArticleById (id) {
        var articleList = ArticleAdmin.prototype.articleList;
        var article;

        for (var i = 0; i < articleList.length; i++) {
            if (articleList[i].id === id) {
                article = articleList[i];
                break;
            }
        }

        return article;
    }


	// 获取文章列表视图并绑定方法
    function createArticleList$el (articleList) {
        var html = '';
        articleList.forEach(function (e) {
            html += '<h4><a data-id=' + e.id + ' href="#">' + e.title + '</a></h4>';
        });

        var $html = $(html);
		// a绑定方法
        $html.find('a').click(function (event) {
            var id = $(this).data('id');
            var article = getArticleById(id);

            $('#editView').data('id', id); // 修改文章，要设置数据id
            $('#title').val(article.title);
			// $('#editor').val(article.content);
            simplemde.value(article.content);
            $('#articleStatus').text('Old');
            $('#editTab a').tab('show');

        });

        return $html;
    }


	// 获取文章列表并缓存下来
    function getArticleList () {
		// $('#list').empty().append('<h4><a href="#">[置顶]开源服务专题之--------mysql的编译安装</a></h4>');

        $.ajax({
            url: 'admin/article/getList',
            type: 'POST',
            dataType: 'json',
        })
		.done(function (data) {
    if (data.errcode === 0) {
        ArticleAdmin.prototype.articleList = data.data;
        $('#list').empty().append(createArticleList$el(data.data));
    } else {
        Common.showPromptBox(data.errmsg);
    }
})
		.fail(function () {
    Common.showPromptBox('获取文章内容，请求失败');
});
    }

	// 将这个类暴露给外部
    return ArticleAdmin;

});
