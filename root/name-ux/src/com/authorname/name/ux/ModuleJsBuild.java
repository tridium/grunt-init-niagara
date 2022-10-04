package {%= package %};

import javax.baja.naming.BOrd;
import javax.baja.nre.annotations.NiagaraSingleton;
import javax.baja.nre.annotations.NiagaraType;
import javax.baja.sys.Sys;
import javax.baja.sys.Type;
import javax.baja.web.js.BJsBuild;

@NiagaraType
@NiagaraSingleton
public final class B{%= jsBuildName %} extends BJsBuild
{
  private B{%= jsBuildName %}()
  {
    super("{%= name %}", BOrd.make("module://{%= name %}/rc/{%= name %}.built.min.js"){% if (useCssResource) { %}, B{%= cssResourceName %}.TYPE{% } %});
  }
}
