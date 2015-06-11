package {%= package %};

import javax.baja.naming.BOrd;
import javax.baja.sys.BSingleton;
import javax.baja.sys.Context;
import javax.baja.sys.Sys;
import javax.baja.sys.Type;
import javax.baja.web.BIFormFactorMax;
import javax.baja.web.js.BIJavaScript;
import javax.baja.web.js.JsInfo;

public final class {%= className %}
    extends BSingleton
    implements BIJavaScript, BIFormFactorMax
{
  private {%= className %}() {}
  public static final {%= className %} INSTANCE = new {%= className %}();

  @Override
  public Type getType() { return TYPE; }
  public static final Type TYPE = Sys.loadType({%= className %}.class);

  public JsInfo getJsInfo(Context cx) { return jsInfo; }

  private static final JsInfo jsInfo =
      JsInfo.make(
        BOrd.make("module://{%= name %}/rc/{%= widgetName %}.js"),
        B{%= jsBuildName %}.TYPE
      );
}