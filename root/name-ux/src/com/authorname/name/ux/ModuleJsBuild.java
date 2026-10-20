package {%= package %};

import {%= publicApiPackage %}.naming.BOrd;
import {%= publicApiPackage %}.nre.annotations.NiagaraSingleton;
import {%= publicApiPackage %}.nre.annotations.NiagaraType;
import {%= publicApiPackage %}.sys.Sys;
import {%= publicApiPackage %}.sys.Type;
import {%= publicApiPackage %}.web.js.BJsBuild;

@NiagaraType
@NiagaraSingleton
public final class B{%= jsBuildName %} extends BJsBuild
{
  private B{%= jsBuildName %}()
  {
    super("{%= name %}", BOrd.make("module://{%= name %}/rc/{%= name %}.built.min.js"){% if (useCssResource) { %}, B{%= cssResourceName %}.TYPE{% } %});
  }
}
