package {%= package %};

import {%= publicApiPackage %}.naming.BOrd;{% if (agentType) { %}
import {%= publicApiPackage %}.nre.annotations.AgentOn;
{% } %}import {%= publicApiPackage %}.nre.annotations.NiagaraSingleton;
import {%= publicApiPackage %}.nre.annotations.NiagaraType;
import {%= publicApiPackage %}.sys.BSingleton;
import {%= publicApiPackage %}.sys.Context;
import {%= publicApiPackage %}.sys.Sys;
import {%= publicApiPackage %}.sys.Type;
import {%= publicApiPackage %}.web.{%= widgetInterface %};
import {%= publicApiPackage %}.web.js.BIJavaScript;
import {%= publicApiPackage %}.web.js.JsInfo;

@NiagaraType{% if (agentType) { %}(
  agent = @AgentOn(
    types = "{%= agentType %}"
  )
){% } %}
@NiagaraSingleton
public final class {%= className %}
    extends BSingleton
    implements BIJavaScript, {%= widgetInterface %}
{
  private {%= className %}() {}
  public JsInfo getJsInfo(Context cx) { return jsInfo; }

  private static final JsInfo jsInfo =
      JsInfo.make(
        BOrd.make("module://{%= name %}/rc/{%= widgetName %}.js"),
        B{%= jsBuildName %}.TYPE
      );
}