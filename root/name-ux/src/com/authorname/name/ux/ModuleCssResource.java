package {%= package %};

import {%= publicApiPackage %}.naming.BOrd;
import {%= publicApiPackage %}.nre.annotations.NiagaraSingleton;
import {%= publicApiPackage %}.nre.annotations.NiagaraType;
import {%= publicApiPackage %}.sys.Sys;
import {%= publicApiPackage %}.sys.Type;
import {%= publicApiPackage %}.web.js.BCssResource;

@NiagaraType
@NiagaraSingleton
public final class B{%= cssResourceName %} extends BCssResource
{
  private B{%= cssResourceName %}()
  {
    super(BOrd.make("module://{%= name %}/rc/{%= name %}.css"));
  }
}
