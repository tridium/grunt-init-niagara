package {%= package %};

import javax.baja.naming.BOrd;
import javax.baja.nre.annotations.NiagaraSingleton;
import javax.baja.nre.annotations.NiagaraType;
import javax.baja.sys.Sys;
import javax.baja.sys.Type;
import javax.baja.web.js.BCssResource;

@NiagaraType
@NiagaraSingleton
public class B{%= cssResourceName %} extends BCssResource
{
  private B{%= cssResourceName %}()
  {
    super(BOrd.make("module://{%= name %}/rc/{%= name %}.css"));
  }
}
