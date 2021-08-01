path = 'node_modules/@angular/flex-layout/typings/module.d.ts'
file = open(path, 'r')
code = file.readlines()
file.close()
new = []
for c in code:
    if 'ModuleWithProviders;' in c:
        print(c)
        c = c.replace('ModuleWithProviders;', 'ModuleWithProviders<FlexLayoutModule>;')
    new.append(c)
file = open(path, 'w')
file.writelines(new)
file.close
print('Terminado!!')