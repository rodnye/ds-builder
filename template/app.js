
function OnStart () {
    
    lay = app.CreateLayout("linear", "vcenter,fillXY");
    web = app.CreateWebView(1, 1);
    
    web.LoadHtml("./Html/index.html");
    
    lay.AddChild(web);
    lay.AddChild(btn);
    app.AddLayout(lay);
}


/**
 * App Event: rotate phone
 */
function OnConfig () {
    let show = app.IsKeyboardShown();
    OnKeyboard(show);
}


/**
 * Event: show keyboard
 */
function OnKeyboard (show) {
    if (show) {
        let width = app.GetScreenWidth();
        let height = app.GetDisplayHeight() - app.GetKeyboardHeight();
        web.SetSize(width, height, "px");
    } 
    else web.SetSize(1, 1);
}
