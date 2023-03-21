# CMS-forNewsEditors

allowing multiple news editors, auditors and managers to create, edit, audit and publish news.
build by React.
JSON Server as fake REST API to create quick back-end for mocking.


Login Module:
-only the administrator is guaranteed the access.


Permission/Role Management Module:
modify users' permission by edit roleState, roleId or region

     "roles": [
    {
      "id": 1,
      "roleName": "superAdmin",
      "roleType": 1,
      "rights": [
        "/news-manage",
        "/news-manage/list",]
    }, ]
    
    
    
  User Info Management Module:
 -modify users detail
  
     "users": [
    {
      "id": 1,
      "username": "admin",
      "password": 3gdw73fyhw89,
      "roleState": true,
      "default": true,
      "region": "",
      "roleId": "1"
    }, ]
    
    
    
   News Edit module:
   -create news--Rich Text Editor(WYSIWYG) 
   -Preview
   -Draft box
   -Update
   -send to audit
   
   
   
   Audit module:
  -Auditor give a pass or deny to news in the list.
   
   
   
   Publish module:
   -publish audited news
   -published news 
   -unpublished news
   
    
