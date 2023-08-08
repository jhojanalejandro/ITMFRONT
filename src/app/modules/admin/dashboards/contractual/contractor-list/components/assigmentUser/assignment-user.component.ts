import { Component, OnInit, Inject, ViewEncapsulation, ChangeDetectorRef, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';
import { AuthService } from 'app/core/auth/auth.service';
import { ContractorService } from '../../../service/contractor.service';
import { TeamModel } from 'app/modules/auth/model/user-model';
import { CodeUser } from 'app/layout/common/enums/userEnum/enumAuth';
import { AssignmentUser, AssignmentType } from '../../../models/assignment-user.model';
import { AssignmentTypeEnumCode } from 'app/layout/common/enums/userEnum/typeAssignmentenum';
import { Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-contractor-payment',
  templateUrl: './assignment-user.component.html',
  styleUrls: ['./assignment-user.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})

export class AssignmentUserComponent implements OnInit {
  users: any;
  supervisors: TeamModel[] = [];
  supervisorSelected: AssignmentUser = null;
  contracts: any;
  userSelected: AssignmentUser[] = [];
  showSupervisors: boolean = false;
  showContractual: boolean = false;
  assignmentUser: AssignmentUser[] = []
  typesAssignment: AssignmentType[] = [];
  contractSelected: string = null;
  typeAsignmentSelected: string = null;
  userPrincipalSelected: AssignmentUser = null;
  private readonly _unsubscribe$ = new Subject<void>();

  constructor(private _contractorService: ContractorService,
    private ref: ChangeDetectorRef,
    private _auth: AuthService,
    public matDialogRef: MatDialogRef<AssignmentUserComponent>,
    _authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public datos: any
  ) {}

  ngOnInit(): void {
    this.contracts = this.datos.contracts;
    this.getContractorPayment();
    this.getTypeAssigment();
  }

  async addAssignmentUsers() {
    debugger
    if(this.contractSelected == null){
      Swal.fire('', 'selecciona  un contrato!', 'warning');
    } else if(this.userSelected.length == 0 &&  this.supervisorSelected == null){
      Swal.fire('', 'Falta información necesaria para la asignación!', 'warning');
    }else{
      if(this.userSelected.length > 0){
        this.assignmentUser = this.userSelected;
      }
      if(this.supervisorSelected != null){
        this.assignmentUser.push(this.supervisorSelected);
      }
      if(this.userPrincipalSelected != null){
        this.assignmentUser.push(this.userPrincipalSelected);
      }
      this._contractorService
        .assignmentUser(this.assignmentUser)
        .pipe(takeUntil(this._unsubscribe$))
        .subscribe((res) => {
          if(res){
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: '',
              html: 'Usuarios asignados correctamente!',
              showConfirmButton: false,
              timer: 1500
            });
          }
        },
          (response) => {
            Swal.fire('Error', 'No se pudo asignar la información!', 'error');
            console.log(response);
          });
    }
    
  }

  closePopup(): void {
    this.matDialogRef.close();
  }

  getContractorPayment() {
    this._auth.getTeams()
    .pipe(takeUntil(this._unsubscribe$))
    .subscribe((Response: TeamModel[]) => {
      this.users = Response.filter(f => f.rollCode == CodeUser.RECRUITER);
      this.supervisors = Response.filter(f => f.rollCode == CodeUser.SUPERVISOR);
      if(this.users.length == 0 && this.supervisors.length ==0){
        Swal.fire('', 'No hay usuarios con roles Asignados!', 'warning');
      }
      if(this.users.length == 0){
        Swal.fire('', 'No hay contractuales Registrados!', 'warning');
      }else{
        this.showContractual = true;
      }
      if( this.supervisors.length ==0){
        Swal.fire('', 'No hay supervisores registrados!', 'warning');
      }else{
        this.showSupervisors = true;
      }

    });
  }
  assignmentUserselectedPrincipal(usuario: any) {
    let assignmwntUser: AssignmentUser = {
      contractId: this.contractSelected,
      userId: usuario.id,
      rollId: usuario.rollId,
      assignmentType: this.typesAssignment.find(f => f.code === AssignmentTypeEnumCode.RESPONSABLECONTRATOCODE).id
    }
    this.userPrincipalSelected = assignmwntUser;
  }

  assignmentUserselectedSecond(usuario: any) {
    let assignmwntUser: AssignmentUser = {
      contractId: this.contractSelected,
      userId: usuario.id,
      rollId: usuario.rollId,
      assignmentType: this.typesAssignment.find(f => f.code === AssignmentTypeEnumCode.APOYORESPONSABLECONTRATO).id
    }
    let indexUser = this.userSelected.findIndex(f => f.userId ==usuario.id)
    if(indexUser < 0){
      this.userSelected.push(assignmwntUser);
    }
  }
  onChangeAdmin(supervisor: any) {
    debugger
    let assignmwntUser: AssignmentUser = {
      contractId: this.contractSelected,
      userId: supervisor.id,
      rollId: supervisor.rollId,
      assignmentType: this.typesAssignment.find(f => f.code === AssignmentTypeEnumCode.SUPERVISORCONTRATOCODE).id
    }
    this.supervisorSelected = assignmwntUser;

  }
  selectionChageContract(contract: any) {
    this.contractSelected = contract.value;
  }

  selectionChageTypeAssigment(contract: any) {
    this.typeAsignmentSelected = contract.value;
  }
  private getTypeAssigment() {
    this._contractorService.getAssignmentType()
    .pipe(takeUntil(this._unsubscribe$))
    .subscribe((Response: AssignmentType[]) => {
      if(Response.length > 0){
        this.typesAssignment = Response;
      }else{
        Swal.fire('', 'No es posible asignar información sin tipos de asignaciones!', 'warning');
        this.closePopup();
      }

    });
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next(null);
    this._unsubscribe$.complete();
  }

}

