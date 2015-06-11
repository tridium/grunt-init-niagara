package {%= package %};

import javax.baja.naming.BOrd;
import javax.baja.sys.Sys;
import javax.baja.sys.Type;
import javax.baja.web.js.BJsBuild;

public class B{%= jsBuildName %} extends BJsBuild
{
  public static final B{%= jsBuildName %} INSTANCE = new B{%= jsBuildName %}(
    "{%= name %}",
    new BOrd[] {
      BOrd.make("module://{%= name %}/rc/{%= name %}.built.min.js")
    }
  );

  @Override
  public Type getType() { return TYPE; }
  public static final Type TYPE = Sys.loadType(B{%= jsBuildName %}.class);

  private B{%= jsBuildName %}(String id, BOrd[] files) { super(id, files); }
}
