package {%= package %};

import javax.baja.naming.BOrd;
import javax.baja.nre.annotations.NiagaraSingleton;
import javax.baja.nre.annotations.NiagaraType;
import javax.baja.sys.BSingleton;
import javax.baja.sys.Context;
import javax.baja.sys.Sys;
import javax.baja.sys.Type;
import javax.baja.web.{%= widgetInterface %};
import javax.baja.web.js.BIJavaScript;
import javax.baja.web.js.JsInfo;

@NiagaraType
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