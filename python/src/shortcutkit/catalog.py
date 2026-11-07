"""Shared generated catalogue and its structural types.

These annotations describe the catalogue interface, not action-specific keyword
checking for the existing dynamic Shortcut API.
"""
import json
from pathlib import Path
from typing import Dict, List, Literal, Optional, TypedDict, Union, cast

JSONValue = Union[None, bool, int, float, str, List["JSONValue"], Dict[str, "JSONValue"]]


class ReferenceOptional(TypedDict, total=False):
    allowed: List[str]


class ReferenceEvidence(ReferenceOptional):
    status: Literal["measured", "not-probed"]


class ParameterOptional(TypedDict, total=False):
    default: JSONValue
    entityType: str


class CatalogParameter(ParameterOptional):
    kind: str
    kindSource: str
    choices: List[str]
    choiceTitles: Dict[str, str]
    label: Optional[str]
    description: Optional[str]
    refs: ReferenceEvidence
    entityStatus: Literal["resolved", "unresolved", "not-applicable"]


class DescriptionEvidence(TypedDict):
    source: Literal["definition", "registry"]
    summary: Literal["present", "absent"]
    note: Literal["present", "absent"]
    result: Literal["present", "absent"]


class OutputEvidence(TypedDict):
    status: Literal["measured", "not-probed"]


class ParameterRule(TypedDict):
    key: str
    relation: str
    values: List[JSONValue]


class AppIntentDescriptor(TypedDict):
    BundleIdentifier: str
    Name: str
    TeamIdentifier: str
    AppIntentIdentifier: str


class ActionOptional(TypedDict, total=False):
    descriptor: AppIntentDescriptor
    filterClass: str


class CatalogApp(TypedDict):
    name: Optional[str]
    bundleIdentifier: Optional[str]


class CatalogAction(ActionOptional):
    key: str
    identifier: str
    name: str
    origin: Literal["builtin", "app-intent"]
    app: CatalogApp
    description: str
    descriptionNote: str
    descriptionResult: str
    descriptionEvidence: DescriptionEvidence
    params: List[str]
    parameters: Dict[str, CatalogParameter]
    output: Optional[str]
    outputTypes: List[str]
    outputClasses: List[str]
    outputClassesBy: Dict[str, Dict[str, List[str]]]
    outputEvidence: OutputEvidence
    inputTypes: List[str]
    inputKey: Optional[str]
    inputRequired: bool
    inputStatus: Literal["declared", "not-declared", "named-parameters"]
    keywords: List[str]
    summary: Optional[str]
    unavailable: bool
    discontinued: bool
    requiresUnlock: bool
    disabledOn: List[str]
    requires: Dict[str, List[ParameterRule]]
    filterStatus: Literal["available", "unresolved", "not-applicable"]


class EntityPropertyOptional(TypedDict, total=False):
    typeInfo: JSONValue


class EntityProperty(EntityPropertyOptional):
    name: str
    type: str


class EntityOptional(TypedDict, total=False):
    find: str


class CatalogEntity(EntityOptional):
    name: str
    app: str
    bundleIdentifier: str
    properties: Dict[str, EntityProperty]


class FilterOptional(TypedDict, total=False):
    units: List[int]
    choices: List[str]


class FilterProperty(FilterOptional):
    operators: List[int]
    values: str


class BoundedFilter(TypedDict):
    property: str
    operators: List[int]


class ContentItemProperty(TypedDict):
    name: str
    valueClass: Optional[str]
    yields: List[str]
    gettable: bool
    filterable: bool
    sortable: bool
    multiple: bool
    userInfo: JSONValue


class OwnedType(TypedDict):
    kind: str
    name: str


class ContentClassOptional(TypedDict, total=False):
    plural: Optional[str]


class CatalogContentItemClass(ContentClassOptional):
    name: Optional[str]
    superclass: Optional[str]
    coercible: bool
    coercesTo: List[str]
    ownedTypes: List[OwnedType]
    properties: List[ContentItemProperty]


class CatalogModel(TypedDict):
    schemaVersion: Literal[1]
    provenance: Dict[str, JSONValue]
    actions: Dict[str, CatalogAction]
    entities: Dict[str, CatalogEntity]
    filters: Dict[str, Dict[str, FilterProperty]]
    filterOperators: Dict[str, int]
    calendarUnits: Dict[str, int]
    byteCountUnits: Dict[str, int]
    boundedFilters: Dict[str, BoundedFilter]
    contentItemClasses: Dict[str, CatalogContentItemClass]
    contentItemTypes: Dict[str, str]


CATALOG: CatalogModel = cast(CatalogModel, json.loads(
    (Path(__file__).resolve().parent / "data" / "catalog.json").read_text(encoding="utf-8")
))
"""The same prepared catalogue snapshot exported by the TypeScript package."""
